# Fetch Prices from ENTSO-E

The service retrieves electricity prices from ENTSO-E and inserts them into DynamoDB.

## Getting started

The software is designed to run on AWS Lambda, triggered by Amazon EventBridge.

### Build

The software should be built using the following command.

```bash
GOOS=linux GOARCH=amd64 go build .
```

Zip the binary and the `bidding_zones.json` file together.

```bash
zip -r fetch-prices bidding_zones.json fetch-prices
```

### Deploy

Upload the zipped file to the Lambda function.

The following parameters from SSM parameter store are needed for the software:

* `entsoe_token`: secret token for the ENTSO-E API (should be of type secret).
* `scheduler_name`: name of the Event Bridge Scheduler that triggers the Lambda function.
* `scheduler_arn`: ARN of the Event Bridge Scheduler that triggers the Lambda function.
* `scheduler_role_arn`: IAM role ARN for the Scheduler.
* `table_name`: the name of the DynamoDB table
* `time_index_name`: the index for searching price data by time from the DynamoDB table.

### Invoking the lambda function

An Event Bridge Schedule is required to trigger the Lambda function, and the software will manage updating the schedule after creation.