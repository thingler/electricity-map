package main

import (
	"context"
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"golang.org/x/exp/slices"
)

// dayAheadPriceData DynamoDB table reprecentation struct
type dayAheadPriceData struct {
	BiddingZone string  `dynamodbav:"bidding_zone"`
	Composite   string  `dynamodbav:"composite"`
	Time        string  `dynamodbav:"time"`
	Resolution  string  `dynamodbav:"resolution"`
	Price       float32 `dynamodbav:"price"`
}

type DayAheadPrice struct {
	Code                          string
	BiddingZone                   string
	Token                         *string
	TableName                     *string
	TimeIndexName                 *string
	Svc                           *dynamodb.Client
	publicationMarketDocument     *PublicationMarketDocument
	acknowledgementMarketDocument *AcknowledgementMarketDocument
	existingDayAheadPriceData     []dayAheadPriceData
}

// GetAPIPrice fetch Day Ahead Price information from the ENTSO-E API
func (price *DayAheadPrice) GetAPIPrice(firstDay string, lastDay string) error {
	const url = "https://web-api.tp.entsoe.eu/api"
	startDate := &Date{
		Location: "UTC",
	}
	startDate.SetDate(firstDay, "23:00:00")
	startDate.IncDays(-1)

	endDate := &Date{
		Location: "UTC",
	}
	endDate.SetDate(lastDay, "23:00:00")

	now := &Date{
		Location: "UTC",
	}
	timeStamp := now.Today().Format(time.RFC3339)

	statusRequestMarketDocument := &StatusRequestMarketDocument{
		Xmlns: "urn:iec62325.351:tc57wg16:451-5:statusrequestdocument:4:0",
		MRID:  "CallToRestfulApi",
		Type:  "A59",
		SenderMarketParticipantMRID: struct {
			Text         string `xml:",chardata"`
			CodingScheme string `xml:"codingScheme,attr"`
		}{
			Text:         "10X1001A1001A450",
			CodingScheme: "A01",
		},
		SenderMarketParticipantMarketRoleType: "A07",
		ReceiverMarketParticipantMRID: struct {
			Text         string `xml:",chardata"`
			CodingScheme string `xml:"codingScheme,attr"`
		}{
			Text:         "10X1001A1001A450",
			CodingScheme: "A01",
		},
		ReceiverMarketParticipantMarketRoleType: "A32",
		CreatedDateTime:                         timeStamp,
		AttributeInstanceComponent: []struct {
			Attribute      string `xml:"attribute"`
			AttributeValue string `xml:"attributeValue"`
		}{
			{
				Attribute:      "DocumentType",
				AttributeValue: "A44",
			},
			{
				Attribute:      "In_Domain",
				AttributeValue: price.Code,
			},
			{
				Attribute:      "Out_Domain",
				AttributeValue: price.Code,
			},
			{
				Attribute:      "TimeInterval",
				AttributeValue: fmt.Sprintf("%s/%s", startDate.Format(time.RFC3339), endDate.Format(time.RFC3339)),
			},
		},
	}

	xmlbody, _ := xml.MarshalIndent(statusRequestMarketDocument, " ", "  ")
	client := &http.Client{}
	req, err := http.NewRequest("POST", url, strings.NewReader(string(xmlbody)))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/xml; charset=utf-8")
	req.Header.Set("SECURITY_TOKEN", *price.Token)
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK || strings.Contains(string(body), "No matching data found for Data item Day-ahead Prices") {
		if err := xml.Unmarshal(body, &price.acknowledgementMarketDocument); err != nil {
			return err
		}
		reason := price.acknowledgementMarketDocument.Reason.Text
		log.Println(price.BiddingZone+":", reason)
	} else {
		if err := xml.Unmarshal(body, &price.publicationMarketDocument); err != nil {
			return err
		}
	}

	return nil
}

// GetDBPrice query DynamoDB table for price data
func (price *DayAheadPrice) GetDBPrice(fromDay string) error {
	startDate := &Date{
		Location: "UTC",
	}
	startDate.SetDate(fromDay, "22:00:00") // Some markets start from time 22.00 (most start from 23.00)
	startDate.IncDays(-1)

	params := &dynamodb.QueryInput{
		TableName:              price.TableName,
		IndexName:              price.TimeIndexName,
		KeyConditionExpression: aws.String("bidding_zone = :hashKey and #time >= :sortkeyval"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":hashKey":    &types.AttributeValueMemberS{Value: price.BiddingZone},
			":sortkeyval": &types.AttributeValueMemberS{Value: startDate.Format("2006-01-02 15:04:05")},
		},
		ExpressionAttributeNames: map[string]string{
			"#time": "time",
		},
	}

	result, err := price.Svc.Query(context.TODO(), params)
	if err != nil {
		return err
	}

	err = attributevalue.UnmarshalListOfMaps(result.Items, &price.existingDayAheadPriceData)
	if err != nil {
		log.Fatalf("Unmarshal error: %s", err)
	}

	return nil
}

// UpdateDB Update the DynamoDB table with price data generated grom the ENTSO-E API
func (price *DayAheadPrice) UpdateDB() (int, error) {
	const maxBatchWriteSize = 25 // DynamoDB can handel max 25 records in BatchWrite
	const maxRequestItemSize = 50

	if price.publicationMarketDocument == nil {
		return 0, nil
	}

	var priceData []dayAheadPriceData

	timePrice := &Date{
		Location: "UTC",
	}

	for _, timeSerie := range price.publicationMarketDocument.TimeSeries {
		startTime := strings.Split(strings.TrimSuffix(timeSerie.Period.TimeInterval.Start, "Z"), "T")
		timePrice.SetDate(startTime[0], startTime[1]+":00")
		resolution := timeSerie.Period.Resolution

		for _, point := range timeSerie.Period.Point {
			priceAmountFloat, _ := strconv.ParseFloat(point.PriceAmount, 32)
			priceAmount := float32(priceAmountFloat)
			timeStamp := timePrice.Format("2006-01-02 15:04:05")

			priceIndex := slices.IndexFunc(
				price.existingDayAheadPriceData,
				func(c dayAheadPriceData) bool {
					return c.BiddingZone == price.BiddingZone && c.Composite == timeStamp+resolution && c.Price == priceAmount
				},
			)

			if priceIndex == -1 {
				priceData = append(priceData, dayAheadPriceData{
					BiddingZone: price.BiddingZone,
					Composite:   timeStamp + resolution,
					Time:        timeStamp,
					Resolution:  resolution,
					Price:       priceAmount,
				})
			}

			switch resolution {
			case "PT60M":
				timePrice.IncHour(1)
			case "PT30M":
				timePrice.IncMinutes(30)
			case "PT15M":
				timePrice.IncMinutes(15)
			default:
				timePrice.IncHour(1)
			}
		}
	}

	requestItems := map[string][]types.WriteRequest{}
	requestItemSize := 0

	for _, data := range priceData {
		av, err := attributevalue.MarshalMap(data)
		if err != nil {
			return 0, err
		}
		requestItems[*price.TableName] = append(requestItems[*price.TableName], types.WriteRequest{
			PutRequest: &types.PutRequest{
				Item: av,
			},
		})
		requestItemSize = len(requestItems[*price.TableName])
		if requestItemSize == maxRequestItemSize {
			break
		}
	}

	for i := 0; i < requestItemSize; i += maxBatchWriteSize {
		writeItems := map[string][]types.WriteRequest{}
		if (i + maxBatchWriteSize) < requestItemSize {
			writeItems[*price.TableName] = requestItems[*price.TableName][i:(i + maxBatchWriteSize)]
		} else {
			writeItems[*price.TableName] = requestItems[*price.TableName][i:requestItemSize]
		}
		batchInput := &dynamodb.BatchWriteItemInput{
			RequestItems: writeItems,
		}
		_, err := price.Svc.BatchWriteItem(context.TODO(), batchInput)
		if err != nil {
			return 0, err
		}
		log.Printf(
			"Wrote %d data points from %s to %s for bidding zone %s",
			len(writeItems[*price.TableName]),
			priceData[i].Time,
			priceData[i+len(writeItems[*price.TableName])-1].Time,
			price.BiddingZone,
		)
	}

	return requestItemSize, nil
}
