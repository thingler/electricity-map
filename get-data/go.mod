module github.com/thingler/electricity-map/get-data

go 1.19

require github.com/aws/aws-sdk-go-v2/config v1.18.7

require (
	github.com/aws/aws-sdk-go-v2/service/dynamodbstreams v1.13.28 // indirect
	github.com/aws/aws-sdk-go-v2/service/internal/accept-encoding v1.9.11 // indirect
	github.com/aws/aws-sdk-go-v2/service/internal/endpoint-discovery v1.7.21 // indirect
	github.com/jmespath/go-jmespath v0.4.0 // indirect
)

require (
	github.com/aws/aws-lambda-go v1.36.1
	github.com/aws/aws-sdk-go-v2 v1.17.3 // indirect
	github.com/aws/aws-sdk-go-v2/credentials v1.13.7 // indirect
	github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue v1.10.8
	github.com/aws/aws-sdk-go-v2/feature/ec2/imds v1.12.21 // indirect
	github.com/aws/aws-sdk-go-v2/internal/configsources v1.1.27 // indirect
	github.com/aws/aws-sdk-go-v2/internal/endpoints/v2 v2.4.21 // indirect
	github.com/aws/aws-sdk-go-v2/internal/ini v1.3.28 // indirect
	github.com/aws/aws-sdk-go-v2/service/dynamodb v1.17.9
	github.com/aws/aws-sdk-go-v2/service/internal/presigned-url v1.9.21 // indirect
	github.com/aws/aws-sdk-go-v2/service/scheduler v1.0.3
	github.com/aws/aws-sdk-go-v2/service/ssm v1.33.4
	github.com/aws/aws-sdk-go-v2/service/sso v1.11.28 // indirect
	github.com/aws/aws-sdk-go-v2/service/ssooidc v1.13.11 // indirect
	github.com/aws/aws-sdk-go-v2/service/sts v1.17.7 // indirect
	github.com/aws/smithy-go v1.13.5 // indirect
	github.com/montanaflynn/stats v0.7.1
	golang.org/x/exp v0.0.0-20221227203929-1b447090c38c
)
