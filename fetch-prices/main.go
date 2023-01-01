package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/scheduler"
	"golang.org/x/exp/slices"
)

type BiddingZones struct {
	BiddingZone string
	Code        string
}

type LambdaSchedulerEvent struct {
	BiddingZone string `json:"BiddingZone"`
}

// HandleRequest lambda init functions
func HandleRequest(ctx context.Context, lambdaEvent LambdaSchedulerEvent) error {
	// Read Bidding Zone Json data from file bidding_zones.json
	biddingZoneJson, err := os.ReadFile("bidding_zones.json")
	if err != nil {
		return err
	}

	var biddingZones []BiddingZones
	err = json.Unmarshal(biddingZoneJson, &biddingZones)
	if err != nil {
		return err
	}

	// Find current BiddingZone from slice.
	bzIndex := slices.IndexFunc(
		biddingZones,
		func(b BiddingZones) bool {
			return b.BiddingZone == lambdaEvent.BiddingZone
		},
	)
	// bzIndex is -1 if Bidding Zone wan't found in the slice
	if bzIndex < 0 {
		bzIndex = 0
	}

	date := &Date{
		Location: "UTC",
	}
	firstDay := date.Today().Format("2006-01-02")
	lastDay := date.IncDays(+2).Format("2006-01-02")

	// AWS CLI configuration
	cfg, err := config.LoadDefaultConfig(context.TODO(), func(o *config.LoadOptions) error {
		o.Region = "eu-west-1"
		return nil
	})
	if err != nil {
		return err
	}

	// DynamoDB clients
	dynamDBSvc := dynamodb.NewFromConfig(cfg)

	// EventBridgeScheduler
	schedulerName := "day_ahead_price"
	schedulerArn := "arn:aws:lambda:eu-west-1:846764252037:function:fetch-prices"
	schedulerRoleArn := "arn:aws:iam::846764252037:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA"
	eventScheduler := &EventBridgeScheduler{
		Svc:     scheduler.NewFromConfig(cfg),
		Name:    &schedulerName,
		Arn:     &schedulerArn,
		RoleArn: &schedulerRoleArn,
	}

	// Update schedule to rate in case the Lambda function crashes or timeout
	nextExcecution := fmt.Sprintf("rate(%d minutes)", 15)
	err = eventScheduler.UpdateSchedule(&nextExcecution, &biddingZones[0].BiddingZone)
	if err != nil {
		return err
	}

	// Loop trough bidding zones and update DynamoDB if there are new price data for the bidding zone
	elementsUpdated := 0
	for i := bzIndex; i < len(biddingZones); i++ {
		biddingZone := biddingZones[i]
		price := &DayAheadPrice{
			Svc:           dynamDBSvc,
			Token:         "6e6bfa68-2eb4-43e6-9e4a-47b85970a031",
			BiddingZone:   biddingZone.BiddingZone,
			Code:          biddingZone.Code,
			TableName:     "day_ahead_prices",
			TimeIndexName: "time-index",
		}

		// Get current pirce information for bidding zone from DynamoDB
		err := price.GetDBPrice(firstDay)
		if err != nil {
			return err
		}

		// Get Price information from the ENTSO-E API
		err = price.GetAPIPrice(firstDay, lastDay)
		if err != nil {
			return err
		}

		// Update DynamoDB table with new price information
		elementsUpdated, err = price.UpdateDB()
		if err != nil {
			return err
		}

		// Update EventBridge Schedule to continue next minute if there was any new price data
		if elementsUpdated > 0 {
			// nextExcecution := fmt.Sprintf("at(%s)", date.Today().IncMinutes(1).RoundMinute().Format("2006-01-02T15:04:05"))
			nextExcecution := fmt.Sprintf("at(%s)", date.Today().IncMinutes(1).Format("2006-01-02T15:04:05"))
			err = eventScheduler.UpdateSchedule(&nextExcecution, &biddingZone.BiddingZone)
			if err != nil {
				return err
			}
			break
		}
	}
	return nil
}

func main() {
	lambda.Start(HandleRequest)
}
