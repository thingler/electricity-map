package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/scheduler"
	"github.com/aws/aws-sdk-go-v2/service/scheduler/types"
)

type EventBridgeScheduler struct {
	Svc     *scheduler.Client
	Name    *string
	Arn     *string
	RoleArn *string
}

func (e *EventBridgeScheduler) UpdateSchedule(nextExcecution *string, biddingZone *string) error {
	scheduleUpdate := scheduler.UpdateScheduleInput{
		Name: e.Name,
		FlexibleTimeWindow: &types.FlexibleTimeWindow{
			Mode: types.FlexibleTimeWindowModeOff,
		},
		ScheduleExpression: nextExcecution,
		Target: &types.Target{
			Arn:     e.Arn,
			RoleArn: e.RoleArn,
			Input:   aws.String(fmt.Sprintf(`{"BiddingZone":"%s"}`, *biddingZone)),
			RetryPolicy: &types.RetryPolicy{
				MaximumRetryAttempts:     aws.Int32(185),
				MaximumEventAgeInSeconds: aws.Int32(86400),
			},
		},
	}
	_, err := e.Svc.UpdateSchedule(context.TODO(), &scheduleUpdate)
	if err != nil {
		return err
	}

	return nil
}
