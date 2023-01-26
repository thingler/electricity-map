package main

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// dayAheadPriceData DynamoDB table reprecentation struct
type dayAheadPriceData struct {
	Time       string  `dynamodbav:"time" json:"time"`
	Resolution string  `dynamodbav:"resolution" json:"resolution"`
	Price      float32 `dynamodbav:"price" json:"price"`
}

type dayAheadPriceDataAllBz struct {
	BiddingZone string  `dynamodbav:"bidding_zone"`
	Time        string  `dynamodbav:"time"`
	Resolution  string  `dynamodbav:"resolution"`
	Price       float32 `dynamodbav:"price"`
}

type DayAheadPrice struct {
	TableName               *string
	TimeIndexName           *string
	ResolutionTimeIndexName *string
	Svc                     *dynamodb.Client
}

// GetDBPrice query DynamoDB table for price data
func (price *DayAheadPrice) GetDBPrice(biddingZone string, fromDay string, toDay string, fromOffset int, toOffset int) ([]dayAheadPriceData, error) {
	var priceData []dayAheadPriceData
	startDate := &Date{
		Location: "UTC",
	}
	startDate.SetDate(fromDay, "00:00:00")
	startDate.IncHour(fromOffset)

	endDate := &Date{
		Location: "UTC",
	}
	endDate.SetDate(toDay, "23:59:59")
	endDate.IncHour(toOffset)

	params := &dynamodb.QueryInput{
		TableName:              price.TableName,
		IndexName:              price.TimeIndexName,
		KeyConditionExpression: aws.String("bidding_zone = :hashKey AND #time BETWEEN :sdate AND :edate"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":hashKey": &types.AttributeValueMemberS{Value: biddingZone},
			":sdate":   &types.AttributeValueMemberS{Value: startDate.Format("2006-01-02 15:04:05")},
			":edate":   &types.AttributeValueMemberS{Value: endDate.Format("2006-01-02 15:04:05")},
		},
		ExpressionAttributeNames: map[string]string{
			"#time": "time",
		},
	}

	result, err := price.Svc.Query(context.TODO(), params)
	if err != nil {
		return priceData, err
	}

	err = attributevalue.UnmarshalListOfMaps(result.Items, &priceData)
	if err != nil {
		log.Fatalf("Unmarshal error: %s", err)
	}

	return priceData, nil
}

// GetDBPrice query DynamoDB table for price data
func (price *DayAheadPrice) GetAllZonesDBPrice(fromDay string, toDay string, fromOffset int, toOffset int) ([]dayAheadPriceDataAllBz, error) {
	var priceData []dayAheadPriceDataAllBz
	startDate := &Date{
		Location: "UTC",
	}
	startDate.SetDate(fromDay, "00:00:00")
	startDate.IncHour(fromOffset)

	endDate := &Date{
		Location: "UTC",
	}
	endDate.SetDate(toDay, "23:59:59")
	endDate.IncHour(toOffset)

	params := &dynamodb.QueryInput{
		TableName:              price.TableName,
		IndexName:              price.ResolutionTimeIndexName,
		KeyConditionExpression: aws.String("resolution = :hashKey AND #time BETWEEN :sdate AND :edate"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":hashKey": &types.AttributeValueMemberS{Value: "PT60M"},
			":sdate":   &types.AttributeValueMemberS{Value: startDate.Format("2006-01-02 15:04:05")},
			":edate":   &types.AttributeValueMemberS{Value: endDate.Format("2006-01-02 15:04:05")},
		},
		ExpressionAttributeNames: map[string]string{
			"#time": "time",
		},
	}

	result, err := price.Svc.Query(context.TODO(), params)
	if err != nil {
		return priceData, err
	}

	err = attributevalue.UnmarshalListOfMaps(result.Items, &priceData)
	if err != nil {
		log.Fatalf("Unmarshal error: %s", err)
	}

	return priceData, nil
}
