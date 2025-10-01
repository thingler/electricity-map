package main

import (
	"encoding/json"
	"math"
	"strconv"

	"github.com/montanaflynn/stats"
)

// LevelsAction
type LevelsAction struct {
	Price *DayAheadPrice
}

// Name returns the name of the action
func (l *LevelsAction) Name() string {
	return "levels"
}

type Levels struct {
	Low        string `json:"low"`
	Medium     string `json:"medium"`
	Concerning string `json:"concerning"`
	High       string `json:"high"`
}

// Do returns one day of Bidding Zone prices for (CET/CEST) but with UTC time stamps
func (l *LevelsAction) Do() (string, error) {
	var err error

	// The official time zone for ENTSO-E is CET/CEST (Brussels time zone)
	loc := "Europe/Brussels"
	date := &Date{
		Location: loc,
	}
	lastDay := date.Today().Format("2006-01-02")
	firstDay := date.IncDays(-60).Format("2006-01-02")

	var priceData []float64

	priceDataSlice, err := l.Price.GetAllZonesDBPrice(firstDay, lastDay, loc)
	if err != nil {
		return "", err
	}
	for _, priceDataHour := range priceDataSlice {
		priceData = append(priceData, float64(priceDataHour.Price))
	}

	data := stats.Float64Data(priceData)

	low, _ := data.Percentile(5)
	medium, _ := data.Percentile(60)
	concerning, _ := data.Percentile(85)
	high, _ := data.Percentile(95)

	json, _ := json.Marshal(Levels{
		Low:       	strconv.FormatFloat(math.Round(low/10)*10, 'f', -1, 64),
		Medium:    	strconv.FormatFloat(math.Round(medium/10)*10, 'f', -1, 64),
		Concerning: strconv.FormatFloat(math.Round(concerning/10)*10, 'f', -1, 64),
		High:       strconv.FormatFloat(math.Round(high/10)*10, 'f', -1, 64),
	})

	return string(json), err
}
