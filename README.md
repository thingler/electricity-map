# Thingler's Electricity Country Map

Thingler's Electricity Country Map, an interactive and up-to-date map for exploring electricity prices in Europe. The map is built using React on the front-end and Go for the backend. The page is hosted on AWS with serverless services, with the goal of keeping hosting costs as low as possible. The pricing data is sourced from ENTSO-E, and updated regularly.

## Features

* Live data of the electricity prices in Europe.
* Data displayed for different countries and regions (Bidding zones).
* User-friendly interface for viewing data.

## Technologies

* React for the front-end.
* Golang for the back-end.
* Amazon S3 for hosting the front-end.
* AWS Lambda for running the back-end.
* Amazon EventBridge for scheduled lambda invocations for fetching the price data from ENTSO-E.
* Amazon DynamoDB for storing and searching trough price data.
* Amazon API Gateway for getting the price data for bidding zones (from DynamoDB).
* Amazon CloudFront for caching static and dynamic content (front-end and API requests).
* AWS Systems Manager - Parameter Store for storing parameters and secrets.
* and Amazon CloudWatch, Amazon Route53, AWS Certificate Manager for monitoring, logging, DNS, encryption in flight and so on...

## Getting started

### Requirements

* [Golang](https://go.dev/)
* [NPM](https://www.npmjs.com/)
* [AWS Command Line Interface](https://aws.amazon.com/cli/)

### Build
* [Fornt-end instructions](frontend/README.md)
* [Get data API instructions](get-data/README.md)
* [Fetch data from ENTSO-E instructions](fetch-prices/README.md)

## Translations

The application supports 36 languages. The translations have been generated with AI and may contain errors or inaccuracies. If you notice any translation issues, please open a pull request with corrections. Translation files are located in `frontend/src/locales/`.

## Contributing

Feel free to open a pull request if you have any improvements or fixes.

## License

This project is licensed under the MIT License.
