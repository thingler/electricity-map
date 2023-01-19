package main

import (
	"encoding/json"
)

// AllAction
type AllAction struct {
	Price        *DayAheadPrice
	Parameters   *map[string]string
	BiddingZones []BiddingZones
}

// Name returns the name of the action
func (a *AllAction) Name() string {
	return "all"
}

func (a *AllAction) Do() (string, error) {
	var err error

	date := &Date{
		Location: "UTC",
	}
	firstDay := date.Today().Format("2006-01-02")

	if dateRequested, exist := (*a.Parameters)["date"]; exist {
		dateSet, err := date.SetDate(dateRequested, "00:00:00")
		if err == nil {
			firstDay = dateSet.Format("2006-01-02")
		}
	}

	priceData := make(map[string][]dayAheadPriceData)

	// Loop trough bidding zones and update DynamoDB if there are new price data for the bidding zone
	for _, biddingZone := range a.BiddingZones {
		// Get current pirce information for bidding zone from DynamoDB
		priceData[biddingZone.BiddingZone], err = a.Price.GetDBPrice(biddingZone.BiddingZone, firstDay, firstDay, -1, -1)
		if err != nil {
			return "", err
		}
	}

	json, _ := json.Marshal(priceData)

	return string(json), err
}
