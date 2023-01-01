package main

import (
	"encoding/xml"
)

type StatusRequestMarketDocument struct {
	XMLName                     xml.Name `xml:"StatusRequest_MarketDocument"`
	Xmlns                       string   `xml:"xmlns,attr"`
	MRID                        string   `xml:"mRID"`
	Type                        string   `xml:"type"`
	SenderMarketParticipantMRID struct {
		Text         string `xml:",chardata"`
		CodingScheme string `xml:"codingScheme,attr"`
	} `xml:"sender_MarketParticipant.mRID"`
	SenderMarketParticipantMarketRoleType string `xml:"sender_MarketParticipant.marketRole.type"`
	ReceiverMarketParticipantMRID         struct {
		Text         string `xml:",chardata"`
		CodingScheme string `xml:"codingScheme,attr"`
	} `xml:"receiver_MarketParticipant.mRID"`
	ReceiverMarketParticipantMarketRoleType string `xml:"receiver_MarketParticipant.marketRole.type"`
	CreatedDateTime                         string `xml:"createdDateTime"`
	AttributeInstanceComponent              []struct {
		Attribute      string `xml:"attribute"`
		AttributeValue string `xml:"attributeValue"`
	} `xml:"AttributeInstanceComponent"`
}

type AcknowledgementMarketDocument struct {
	XMLName                     xml.Name `xml:"Acknowledgement_MarketDocument"`
	Xmlns                       string   `xml:"xmlns,attr"`
	MRID                        string   `xml:"mRID"`
	CreatedDateTime             string   `xml:"createdDateTime"`
	SenderMarketParticipantMRID struct {
		Text         string `xml:",chardata"`
		CodingScheme string `xml:"codingScheme,attr"`
	} `xml:"sender_MarketParticipant.mRID"`
	SenderMarketParticipantMarketRoleType string `xml:"sender_MarketParticipant.marketRole.type"`
	ReceiverMarketParticipantMRID         struct {
		Text         string `xml:",chardata"`
		CodingScheme string `xml:"codingScheme,attr"`
	} `xml:"receiver_MarketParticipant.mRID"`
	ReceiverMarketParticipantMarketRoleType string `xml:"receiver_MarketParticipant.marketRole.type"`
	ReceivedMarketDocumentCreatedDateTime   string `xml:"received_MarketDocument.createdDateTime"`
	Reason                                  struct {
		Code string `xml:"code"`
		Text string `xml:"text"`
	} `xml:"Reason"`
}

type PublicationMarketDocument struct {
	XMLName                     xml.Name `xml:"Publication_MarketDocument"`
	Xmlns                       string   `xml:"xmlns,attr"`
	MRID                        string   `xml:"mRID"`
	RevisionNumber              string   `xml:"revisionNumber"`
	Type                        string   `xml:"type"`
	SenderMarketParticipantMRID struct {
		Text         string `xml:",chardata"`
		CodingScheme string `xml:"codingScheme,attr"`
	} `xml:"sender_MarketParticipant.mRID"`
	SenderMarketParticipantMarketRoleType string `xml:"sender_MarketParticipant.marketRole.type"`
	ReceiverMarketParticipantMRID         struct {
		Text         string `xml:",chardata"`
		CodingScheme string `xml:"codingScheme,attr"`
	} `xml:"receiver_MarketParticipant.mRID"`
	ReceiverMarketParticipantMarketRoleType string `xml:"receiver_MarketParticipant.marketRole.type"`
	CreatedDateTime                         string `xml:"createdDateTime"`
	PeriodTimeInterval                      struct {
		Start string `xml:"start"`
		End   string `xml:"end"`
	} `xml:"period.timeInterval"`
	TimeSeries []struct {
		MRID         string `xml:"mRID"`
		BusinessType string `xml:"businessType"`
		InDomainMRID struct {
			Text         string `xml:",chardata"`
			CodingScheme string `xml:"codingScheme,attr"`
		} `xml:"in_Domain.mRID"`
		OutDomainMRID struct {
			Text         string `xml:",chardata"`
			CodingScheme string `xml:"codingScheme,attr"`
		} `xml:"out_Domain.mRID"`
		CurrencyUnitName     string `xml:"currency_Unit.name"`
		PriceMeasureUnitName string `xml:"price_Measure_Unit.name"`
		CurveType            string `xml:"curveType"`
		Period               struct {
			TimeInterval struct {
				Start string `xml:"start"`
				End   string `xml:"end"`
			} `xml:"timeInterval"`
			Resolution string `xml:"resolution"`
			Point      []struct {
				Position    string `xml:"position"`
				PriceAmount string `xml:"price.amount"`
			} `xml:"Point"`
		} `xml:"Period"`
	} `xml:"TimeSeries"`
}

type GLMarketDocument struct {
	XMLName                     xml.Name `xml:"GL_MarketDocument"`
	Xmlns                       string   `xml:"xmlns,attr"`
	MRID                        string   `xml:"mRID"`
	RevisionNumber              string   `xml:"revisionNumber"`
	Type                        string   `xml:"type"`
	ProcessProcessType          string   `xml:"process.processType"`
	SenderMarketParticipantMRID struct {
		Text         string `xml:",chardata"`
		CodingScheme string `xml:"codingScheme,attr"`
	} `xml:"sender_MarketParticipant.mRID"`
	SenderMarketParticipantMarketRoleType string `xml:"sender_MarketParticipant.marketRole.type"`
	ReceiverMarketParticipantMRID         struct {
		Text         string `xml:",chardata"`
		CodingScheme string `xml:"codingScheme,attr"`
	} `xml:"receiver_MarketParticipant.mRID"`
	ReceiverMarketParticipantMarketRoleType string `xml:"receiver_MarketParticipant.marketRole.type"`
	CreatedDateTime                         string `xml:"createdDateTime"`
	TimePeriodTimeInterval                  struct {
		Start string `xml:"start"`
		End   string `xml:"end"`
	} `xml:"time_Period.timeInterval"`
	TimeSeries []struct {
		MRID                    string `xml:"mRID"`
		BusinessType            string `xml:"businessType"`
		ObjectAggregation       string `xml:"objectAggregation"`
		InBiddingZoneDomainMRID struct {
			Text         string `xml:",chardata"`
			CodingScheme string `xml:"codingScheme,attr"`
		} `xml:"inBiddingZone_Domain.mRID"`
		QuantityMeasureUnitName string `xml:"quantity_Measure_Unit.name"`
		CurveType               string `xml:"curveType"`
		Period                  struct {
			TimeInterval struct {
				Start string `xml:"start"`
				End   string `xml:"end"`
			} `xml:"timeInterval"`
			Resolution string `xml:"resolution"`
			Point      []struct {
				Position string `xml:"position"`
				Quantity string `xml:"quantity"`
			} `xml:"Point"`
		} `xml:"Period"`
	} `xml:"TimeSeries"`
}
