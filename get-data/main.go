package main

import (
	"context"
	"encoding/json"
	"log"
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

type LogLine struct {
	Path         string `json:"path"`
	Method       string `json:"method"`
	QueryString  string `json:"query_string"`
	ResponseCode uint16 `json:"response_code"`
}

func LogRequest(request events.APIGatewayV2HTTPRequest, response uint16) {
	logLine := &LogLine{
		Path:         request.RawPath,
		Method:       request.RequestContext.HTTP.Method,
		QueryString:  request.RawQueryString,
		ResponseCode: response,
	}
	logJson, _ := json.Marshal(logLine)
	log.Println(string(logJson))
}

// HandleWarmingRequest to keep lambda function warm
func HandleWarmingRequest(ctx context.Context) (error) {
	log.Println("Warming request")
	return nil
}

// HandleAPIGatewayRequest lambda init functions
func HandleAPIGatewayRequest(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
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

	response := &HTTPResponse{
		Headers:    &request.Headers,
		Parameters: &request.QueryStringParameters,
	}

	// AWS CLI configuration
	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "eu-west-1"
		return nil
	})
	if err != nil {
		resp := response.GetError()
		LogRequest(request, uint16(resp.StatusCode))
		return resp, nil
	}

	// DynamoDB clients
	dynamDBSvc := dynamodb.NewFromConfig(cfg)

	// Get parameters from SSM Parameter Store
	parameter := SSMParameter{
		Svc: ssm.NewFromConfig(cfg),
	}
	tableName := parameter.GetParameter("table_name")
	timeIndexName := parameter.GetParameter("time_index_name")
	resolutionTimeIndexName := parameter.GetParameter("resolution_time_index_name")

	// Read Bidding Zone Json data from file bidding_zones.json
	biddingZoneJson, err := os.ReadFile("bidding_zones.json")
	if err != nil {
		resp := response.GetError()
		LogRequest(request, uint16(resp.StatusCode))
		return resp, nil
	}

	var biddingZones []BiddingZones
	err = json.Unmarshal(biddingZoneJson, &biddingZones)
	if err != nil {
		resp := response.GetError()
		LogRequest(request, uint16(resp.StatusCode))
		return resp, nil
	}

	price := &DayAheadPrice{
		Svc:                     dynamDBSvc,
		TableName:               tableName,
		TimeIndexName:           timeIndexName,
		ResolutionTimeIndexName: resolutionTimeIndexName,
	}

	all := &AllAction{
		Price:        price,
		Parameters:   &request.QueryStringParameters,
		BiddingZones: biddingZones,
	}

	bz := &BzAction{
		Price:      price,
		Parameters: &request.QueryStringParameters,
	}

	levels := &LevelsAction{
		Price:        price,
	}

	action := NewActionFactory().
		AddAction(all).
		AddAction(bz).
		AddAction(levels).
		GetAction(&request.QueryStringParameters)

	body, err := action.Do()
	if err != nil {
		resp := response.GetError()
		LogRequest(request, uint16(resp.StatusCode))
		return resp, nil
	}

	resp := response.GetSuccess(body)
	LogRequest(request, uint16(resp.StatusCode))
	return resp, nil
}

// Universal handler function
func HandleRequest(ctx context.Context, event json.RawMessage) (interface{}, error) {
    var apiGatewayEvent events.APIGatewayV2HTTPRequest
	err := json.Unmarshal(event, &apiGatewayEvent)
	if err != nil {
		return nil, err
	}
	if apiGatewayEvent.Version != "" {
		// It's an API Gateway event
		return HandleAPIGatewayRequest(ctx, apiGatewayEvent)
	} else {
		// keep lambda function warm
		return nil, HandleWarmingRequest(ctx)
	}
}

func main() {
	lambda.Start(HandleRequest)
}
