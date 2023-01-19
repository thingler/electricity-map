package main

import (
	"encoding/json"
	"strings"
)

// BzAction
type BzAction struct {
	Price      *DayAheadPrice
	Parameters *map[string]string
}

// Name returns the name of the action
func (bz *BzAction) Name() string {
	return "bz"
}

func (bz *BzAction) Do() (string, error) {
	var err error

	date := &Date{
		Location: "UTC",
	}
	firstDay := date.Today().Format("2006-01-02")

	if dateRequested, exist := (*bz.Parameters)["date"]; exist {
		dateSet, err := date.SetDate(dateRequested, "00:00:00")
		if err == nil {
			firstDay = dateSet.Format("2006-01-02")
		}
	}

	var biddingZones []string

	if bzParam, exist := (*bz.Parameters)["bz"]; exist {
		biddingZones = strings.Split(bzParam, ",")
	}

	priceData := make(map[string][]dayAheadPriceData)

	// Loop trough bidding zones and update DynamoDB if there are new price data for the bidding zone
	for _, biddingZone := range biddingZones {
		// Get current pirce information for bidding zone from DynamoDB
		priceData[biddingZone], err = bz.Price.GetDBPrice(biddingZone, firstDay, firstDay, -3, 0)
		if err != nil {
			return "", err
		}
	}

	json, _ := json.Marshal(priceData)

	return string(json), err
}
