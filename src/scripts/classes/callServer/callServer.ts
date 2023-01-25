import type { CallServerInterface } from "./interfaces/callServer";
import { parserText } from "../../utils/parseText";
import { xml2json } from "../../utils/xml2json";
export class CallServer implements CallServerInterface {
    public endpoint: string = " http://api.darinab2b.com";

    constructor() {
    }
    /**
     * this function convert xml data to js object
     * @return result after convert
     */
    converter(data: string): any {
        // convert text data to XMLDom
        const parser = parserText(data, "text/xml");
        // convert xml to json
        const jsonText = xml2json(parser, "");
        // convert json to js object
        const result = JSON.parse(jsonText)
        return result;
    }
    /**
     * this function return data from server
     * @return json data
     */
    async getData(): Promise<Object> {
        // soap envelope data
        const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <CheckAvailability_ViaPropertiesIds xmlns="http://travelcontrol.softexsw.us/">
                <SecStr>#C|559341#W#274298</SecStr>
                <AccountName>DTC</AccountName>
                <UserName>XML2016Ra</UserName>
                <Password>DarinAH</Password>
                <AgentID>1701</AgentID>
                <FromDate>20/02/2023</FromDate>
                <ToDate>21/02/2023</ToDate>
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
                <OccupancyID>0</OccupancyID>
                <RoomType>0</RoomType>
                <MealPlan>0</MealPlan>
                <GetHotelImageLink>true</GetHotelImageLink>
                <GetHotelMapLink>true</GetHotelMapLink>
                <Source>0</Source>
                <LimitRoomTypesInResult>0</LimitRoomTypesInResult>
                <HotelsID_List>
                    <int>1793</int>
                    <int>1866</int>
                </HotelsID_List>
                </CheckAvailability_ViaPropertiesIds>
            </soap:Body>
            </soap:Envelope>`
        // send request to server and wait for response
        let response = null;
        try {
            response = await fetch(`${this.endpoint}/service_v4.asmx`, {
                method: "POST",
                headers: {
                    "Content-Type": "text/xml; charset=utf-8",
                    "SOAPAction": "http://travelcontrol.softexsw.us/CheckAvailability_ViaPropertiesIds",
                    "Content-Length": soapEnvelope.length.toString(),
                },
                body: soapEnvelope,
            });
        } catch(err) {
            console.log(err);
        }


        // check ressonse
        if (response && response.ok) {
            // convert xml response to text
            response.text().then(data => {
                // main table element
                const mainTabel = document.querySelector(".main-tabel") as HTMLElement;

                // convert data to js object
                const convertedData = this.converter(data);

                console.log(convertedData);

                // access availability
                const availability = convertedData["soap:Envelope"]["soap:Body"]["CheckAvailability_ViaPropertiesIdsResponse"]["CheckAvailability_ViaPropertiesIdsResult"];

                // get availability data
                const availability_data = availability["D"];

                // check if availability data if found, if not render error message
                if (availability_data) {


                    // all rates
                    const rates = availability_data["AccRates"];

                    // the keys of rates
                    const keys = ["Hotel", "RoomType", "MealPlan", "RatePerNight", "RatePerStay", "Availability", "HasMealUpgrade", "Occupancy"];

                    // first render headers
                    let headers = ``;

                    for (const key of keys) {
                        headers += `<th scope="col" class="px-6 py-3">
                                        ${key}
                                    </th>`;
                    }

                    // rows of table
                    let rows = ``;

                    for (const rate of rates) {
                        let row = ``;
                        for (const key of keys) {
                            if (key == 'Hotel') {
                                row += `<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            ${rate[key]}
                                        </th>`
                            } else {
                                row += `<td class="px-6 py-4">
                                            ${rate[key]}
                                        </td>`
                            }
                        }
                        // after each row append current row to rows
                        rows += `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    ${row}
                                </tr>`;
                    }
                    // tabel element
                    const tabel = `
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                ${headers}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>`;

                    // render tabel in main tabel
                    this.render(mainTabel, tabel);
                } else {
                    // error message
                    const error = availability["ResultInfo"]["ErrorTxt"];

                    // text element
                    const text = `<p class='text-red-600 m-4 flex justify-center'>${error}</p>`

                    // render error
                    this.render(mainTabel, text);
                }
            })
        }
        return {}
    }
    /**
     * this function render data to layout
     * @param target - the element will render value inside it
     * @param value - the value of render
     * @param mode - the mode of render
     * @return None
     */
    render(target: HTMLElement, value: string, mode: "assign" | "increase" = "assign"): void {
        if (mode == "assign") {
            target.innerHTML = value;
        } else {
            target.innerHTML += value;
        }
    }
}