require("dotenv").config();
const superagent = require("superagent");
const AWS = require("aws-sdk");
const fs = require("fs/promises");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var ses = new AWS.SES({ region: "us-east-1" });

function sendEmail(address, subject, body) {
  var params = {
    Destination: { ToAddresses: [address] },
    Message: {
      Body: { Html: { Data: body } },
      Subject: { Data: subject },
    },
    Source: "vax-notifications@benspowell.com",
  };
  ses.sendEmail(params, function (err, data) {
    console.log("Error: " + err);
    console.log("Data: " + data);
  });
}

function getAppointmentsByZip(zip) {
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
}

exports.handler = async (event, context, callback) => {
  let zipCodes = (await fs.readFile("zip_codes.txt")).toString().split("\n");
  let appointments = [];
  let errors = [];
  let allResponses = [];

  for (let zipCode of zipCodes) {
    try {
      console.log("Trying " + zipCode + "...");
      let res = await getAppointmentsByZip(zipCode);
      console.log(res.body.responseMetaData.statusDesc + "\n");
      allResponses.push(res.body);
      if (res.body.responseMetaData.statusDesc == "Success") {
        res.body.responsePayloadData.locations.forEach((location) => {
          location.imzAdditionalData.availableDates.forEach((apptDate) => {
            appointments.push({
              zip: location.addressZipCode,
              address: `${location.addressLine}
                ${location.addressCityDescriptionText} ${location.addressState} ${location.addressZipCode}`,
              date: apptDate,
            });
          });
        });
      }
    } catch (error) {
      console.log(error);
      errors.push(error);
    }
  }
  console.log(appointments);

  sendEmail(
    "hello@benspowell.com",
    appointments.length + " Appointments Found",
    `
    <h1>Appointment Data</h1>
    <p>${JSON.stringify(appointments)}</p>

    <h1>Errors</h1>
    <p>${JSON.stringify(errors)}</p>

    <h1>All Responses</h1>
    <p>${JSON.stringify(allResponses)}</p>
    `
  );
};