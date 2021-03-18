const superagent = require("superagent");

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
    .set("authority", "www.cvs.com")
    .set("pragma", "no-cache")
    .set("cache-control", "no-cache")
    .set(
      "sec-ch-ua",
      '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"'
    )
    .set("accept", "application/json")
    .set("sec-ch-ua-mobile", "?0")
    .set(
      "user-agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    )
    .set("content-type", "application/json")
    .set("origin", "https://www.cvs.com")
    .set("sec-fetch-site", "same-origin")
    .set("sec-fetch-mode", "cors")
    .set("sec-fetch-dest", "empty")
    .set(
      "referer",
      "https://www.cvs.com/vaccine/intake/store/cvd-store-select/first-dose-select"
    )
    .set("sec-gpc", "1");
};
