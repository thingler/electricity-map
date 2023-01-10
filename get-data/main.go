package main

import (
	"context"
	"encoding/json"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/ssm"
)

type BiddingZones struct {
	BiddingZone string
	Code        string
}

type LambdaSchedulerEvent struct {
	BiddingZone string `json:"BiddingZone"`
}

// HandleRequest lambda init functions
func HandleRequest(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	response := events.APIGatewayV2HTTPResponse{
		StatusCode:      200,
		Body:            "[]",
		IsBase64Encoded: false,
		Headers: map[string]string{
			"content-type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	}
	// log.Println("Version", request.Version)
	// log.Println("RouteKey", request.RouteKey)
	// log.Println("RawPath", request.RawPath)

	// log.Println("RawQueryString", request.RawQueryString)

	// log.Println("Cookies", request.Cookies)
	// log.Println("Headers", request.Headers)

	// for key, header := range request.Headers {
	// 	log.Println("Header", key, header)
	// }

	// for key, parameter := range request.QueryStringParameters {
	// 	log.Println("PathParameter", key, parameter)
	// }

	// log.Println("Method", request.RequestContext.HTTP.Method)
	// log.Println("Path", request.RequestContext.HTTP.Path)
	// log.Println("Protocol", request.RequestContext.HTTP.Protocol)
	// log.Println("SourceIP", request.RequestContext.HTTP.SourceIP)
	// log.Println("UserAgent", request.RequestContext.HTTP.UserAgent)

	// AWS CLI configuration
	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "eu-west-1"
		return nil
	})
	if err != nil {
		return response, err
	}

	// Get parameters from SSM Parameter Store
	parameter := SSMParameter{
		Svc: ssm.NewFromConfig(cfg),
	}
	tableName := parameter.GetParameter("table_name")
	timeIndexName := parameter.GetParameter("time_index_name")

	// Read Bidding Zone Json data from file bidding_zones.json
	biddingZoneJson, err := os.ReadFile("bidding_zones.json")
	if err != nil {
		return response, err
	}

	var biddingZones []BiddingZones
	err = json.Unmarshal(biddingZoneJson, &biddingZones)
	if err != nil {
		return response, err
	}

	date := &Date{
		Location: "UTC",
	}
	firstDay := date.Today().Format("2006-01-02")

	if dateRequested, exist := request.QueryStringParameters["date"]; exist {
		dateSet, err := date.SetDate(dateRequested, "00:00:00")
		if err == nil {
			firstDay = dateSet.Format("2006-01-02")
		}
	}

	// DynamoDB clients
	dynamDBSvc := dynamodb.NewFromConfig(cfg)

	// var priceData map[string][]dayAheadPriceData
	priceData := make(map[string][]dayAheadPriceData)

	// Loop trough bidding zones and update DynamoDB if there are new price data for the bidding zone
	for _, biddingZone := range biddingZones {
		price := &DayAheadPrice{
			Svc:           dynamDBSvc,
			BiddingZone:   biddingZone.BiddingZone,
			TableName:     tableName,
			TimeIndexName: timeIndexName,
		}

		// Get current pirce information for bidding zone from DynamoDB
		priceData[biddingZone.BiddingZone], err = price.GetDBPrice(firstDay, firstDay)
		if err != nil {
			return response, err
		}

	}

	json, _ := json.Marshal(priceData)
	response.Body = string(json)

	return response, nil
}

func main() {
	lambda.Start(HandleRequest)
}
