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

// Do returns one day of Bidding Zone prices for (CET/CEST) but with UTC time stamps
func (a *AllAction) Do() (string, error) {
	var err error

	// The official time zone for ENTSO-E is CET/CEST (Brussels time zone)
	loc := "Europe/Brussels"
	date := &Date{
		Location: loc,
	}
	firstDay := date.Today().Format("2006-01-02")

	if dateRequested, exist := (*a.Parameters)["date"]; exist {
		dateSet, err := date.SetDate(dateRequested, "00:00:00")
		if err == nil {
			firstDay = dateSet.Format("2006-01-02")
		}
	}

	priceData := make(map[string][]dayAheadPriceData)

	priceDataSlice15Min, err := a.Price.GetAllZonesDBPrice(firstDay, firstDay, loc, "PT15M")
	if err != nil {
		return "", err
	}

	priceDataSlice60Min, err := a.Price.GetAllZonesDBPrice(firstDay, firstDay, loc, "PT60M")
	if err != nil {
		return "", err
	}

	// Combine both slices
	allPriceData := append(priceDataSlice15Min, priceDataSlice60Min...)

	for _, priceDataItem := range allPriceData {
		biddingZone := priceDataItem.BiddingZone
		priceData[biddingZone] = append(priceData[biddingZone], dayAheadPriceData{
			Time:       priceDataItem.Time,
			Resolution: priceDataItem.Resolution,
			Price:      priceDataItem.Price,
		})
	}

	json, _ := json.Marshal(priceData)

	return string(json), err
}
