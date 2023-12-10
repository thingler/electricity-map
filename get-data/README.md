# Get Price data for Bidding Zones

The service retrieves electricity prices from a DynamoDB table.

## Getting started

The software is designed to operate as an AWS Lambda function, triggered by Amazon API Gateway.

### Build

The software should be built using the following command.

```bash
GOOS=linux GOARCH=arm64 go build -o bootstrap
```

Zip the binary and the `bidding_zones.json` file together.

```bash
zip -r get-data.zip bidding_zones.json bootstrap
```

### Deploy

Upload the zipped file to the Lambda function.

The following parameters from SSM parameter store are needed for the software:

* `table_name`: the name of the DynamoDB table
* `time_index_name`: the index for searching price data by time from the DynamoDB table.
* `resolution_time_index_name`: the index for searching price data by resolution and time from the DynamoDB table.

### Invoking the lambda function

Configure Amazon API Gateway to trigger the Lambda function for API requests.
