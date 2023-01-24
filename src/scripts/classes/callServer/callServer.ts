
import type { CallServerInterface } from "./interfaces/callServer";

export class CallServer implements CallServerInterface {
    public endpoint: string = " http://api.darinab2b.com";
    
    // public baseBody: FormData = new FormData();
    constructor() {
    }
    /**
     * this function convert xml data to json
     */
    converter(data: string): object {
        // create DOMParser object
        // const parser = new DOMParser();

        // // parse xml document
        // const doc = parser.parseFromString(data, 'application/xml');
        console.log(data)
        return {}
    }
    /**
     * this function return data from server
     * @return json data
     */
    async getData(): Promise<Object> {
        // soap envelope data
        const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
            <CheckAvailability_ViaPropertiesIds 
            xmlns="http://travelcontrol.softexsw.us/">
            <SecStr>#C|559341#W#274298</SecStr>
            <AccountName>DTC</AccountName>
            <UserName>XML2016Ra</UserName>
            <Password>DarinAH</Password>
            <AgentID>1701</AgentID>
            <FromDate>20/11/2022</FromDate>
            <ToDate>21/11/2022</ToDate>
            <OccupancyID>0</OccupancyID>
            <AdultPax>4</AdultPax>
            <ChildPax>2</ChildPax>
            <ChildrenAges>
                <int>8</int>
                <int>8</int>
            </ChildrenAges>
            <ExtraBedAdult>false</ExtraBedAdult>
            <ExtraBedChild>false</ExtraBedChild>
            <Nationality_CountryID>340</Nationality_CountryID>
            <CurrencyID>1</CurrencyID>
            <MaxOverallPrice>0</MaxOverallPrice>
            <Availability>ShowAvailableOnly</Availability>
            <RoomType>0</RoomType>
            <MealPlan>0</MealPlan>
            <GetHotelImageLink>true</GetHotelImageLink>
            <GetHotelMapLink>true</GetHotelMapLink>
            <Source>0</Source>
            <LimitRoomTypesInResult>0</LimitRoomTypesInResult>
            <HotelsID_List>
                <int>1793</int>
                <int>1866</int>
                <int>287</int>
            </HotelsID_List>
            </CheckAvailability_ViaPropertiesIds>
            </soap:Body>
            </soap:Envelope>`
        // send request to server and wait for response
        const response = await fetch(`${this.endpoint}/service_v4.asmx`, {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": "http://travelcontrol.softexsw.us/CheckAvailability",
                "Content-Length": soapEnvelope.length.toString(),
            },
            body: soapEnvelope,
        });

        // check ressonse
        if (response.ok) {
            // convert xml response to text
            response.text().then(data => {
                console.log(data)
                // convert xml data to json data
                // const result = this.converter(data);
            })
        }
        return {}
    }
    /**
     * this function render data to layout
     */
    render(): void {

    }
}