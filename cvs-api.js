const superagent = require("superagent");

const HEADERS = {
  authority: "www.cvs.com",
  pragma: "no-cache",
  "cache-control": "no-cache",
  "sec-ch-ua":
    '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
  accept: "application/json",
  "sec-ch-ua-mobile": "?0",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
  "content-type": "application/json",
  origin: "https://www.cvs.com",
  "sec-fetch-site": "same-origin",
  "sec-fetch-mode": "cors",
  "sec-fetch-dest": "empty",
  "sec-gpc": "1",
};

exports.getAppointmentsNearZipCode = (zip) => {
  return superagent
    .post(
      "https://www.cvs.com/Services/ICEAGPV1/immunization/1.0.0/getIMZStores"
    )
    .send({
      requestMetaData: {
        appName: "CVS_WEB",
        lineOfBusiness: "RETAIL",
        channelName: "WEB",
        deviceType: "DESKTOP",
        deviceToken: "7777",
        apiKey: "a2ff75c6-2da7-4299-929d-d670d827ab4a",
        source: "ICE_WEB",
        securityType: "apiKey",
        responseFormat: "JSON",
        type: "cn-dep",
      },
      requestPayloadData: {
        selectedImmunization: ["CVD"],
        distanceInMiles: 35,
        imzData: [
          {
            imzType: "CVD",
            ndc: ["59267100002", "59267100003", "59676058015", "80777027399"],
            allocationType: "1",
          },
        ],
        searchCriteria: { addressLine: zip },
      },
    })
    .set(HEADERS)
    .set(
      "referer",
      "https://www.cvs.com/vaccine/intake/store/cvd-store-select/first-dose-select"
    );
};
exports.getCitiesWithVaccineAvailability = () => {
  return superagent
    .get(
      "https://www.cvs.com/immunizations/covid-19-vaccine.vaccine-status.oh.json?vaccineinfo"
    )
    .set(HEADERS)
    .set("referer", "https://www.cvs.com/immunizations/covid-19-vaccine");
};

exports.getAppointmentsFromZips = async (zipCodes) => {
  let appointments = [];
  try {
    for (let zipCode of zipCodes) {
      let res = await exports.getAppointmentsNearZipCode(zipCode);

      console.log("Checking for appointments near " + zipCode + "...");
      console.log(res.body.responseMetaData.statusDesc + "\n");

      if (res.body.responseMetaData.statusDesc == "Success") {
        for (let location of res.body.responsePayloadData.locations) {
          let dates = location.imzAdditionalData
            .map((data) => data.availableDates)
            .flat(2);

          for (let date of dates) {
            let appointment = {
              address: `${location.addressLine} ${location.addressCityDescriptionText} ${location.addressState} ${location.addressZipCode}`,
              manufacturer: location.mfrName,
              date: date,
            };
            if (
              !appointments.find(
                (el) =>
                  el.address == appointment.address &&
                  el.date == appointment.date
              )
            )
              appointments.push(appointment);
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  return appointments;
};
