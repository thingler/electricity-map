package main

import (
	"crypto/md5"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
)

type HTTPResponse struct {
	Headers    *map[string]string
	Parameters *map[string]string
}

// GetSuccess returns eather an 304 - not modified or an 200 - ok response
// Cache-Control is set to one week for old data, and 15 minutes for data that we are still waiting for
func (r *HTTPResponse) GetSuccess(body string) events.APIGatewayV2HTTPResponse {

	eTag := fmt.Sprintf(`W/"%x"`, md5.Sum([]byte(body)))
	response := events.APIGatewayV2HTTPResponse{
		StatusCode:      200,
		IsBase64Encoded: false,
		Headers: map[string]string{
			"content-type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	}

	if ifNoMatch, exist := (*r.Headers)["if-none-match"]; exist {
		if eTag == ifNoMatch {
			response.StatusCode = 304
			return response
		}
	}

	date := &Date{
		Location: "UTC",
	}
	today := date.Today().Format("2006-01-02")
	reqestDay := today

	if dateRequested, exist := (*r.Parameters)["date"]; exist {
		dateSet, err := date.SetDate(dateRequested, "00:00:00")
		if err == nil {
			reqestDay = dateSet.Format("2006-01-02")
		}
	}

	// response.Headers = make(map[string]string)
	if reqestDay > today {
		// Cache for 15 minutes
		response.Headers["cache-control"] = "max-age=900"
	} else {
		// Cache for one week
		response.Headers["cache-control"] = "max-age=604800"
	}

	response.Body = body
	response.Headers["etag"] = eTag

	return response
}

// GetError returns an HTTP error resonse
func (r *HTTPResponse) GetError() events.APIGatewayV2HTTPResponse {
	return events.APIGatewayV2HTTPResponse{
		StatusCode:      500,
		IsBase64Encoded: false,
		Headers: map[string]string{
			"cache-control": "max-age=10",
		},
	}
}
