package main

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/ssm"
)

type SSMParameter struct {
	Svc *ssm.Client
}

// GetParameter from SSM Parameter Store
func (p *SSMParameter) GetParameter(parameter string) *string {
	parameterInput := &ssm.GetParameterInput{
		Name:           &parameter,
		WithDecryption: aws.Bool(true),
	}
	parameterOutput, err := p.Svc.GetParameter(context.TODO(), parameterInput)
	if err != nil {
		log.Println(err)
		return nil
	}

	return parameterOutput.Parameter.Value
}
