require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs/promises");
const cvsApi = require("./cvs-api");
const mailUtil = require("./mail-util");

exports.handler = async (event, context, callback) => {
  let zipCodes = (await fs.readFile("zip_codes.txt")).toString().split("\n"),
    appointments = [],
    errors = [],
    allResponses = [];

  for (let zipCode of zipCodes) {
    try {
      console.log("Trying " + zipCode + "...");
      let res = await cvsApi.getAppointmentsNearZipCode(zipCode);

      console.log(res.body.responseMetaData.statusDesc + "\n");
      allResponses.push(res.body);
      if (res.body.responseMetaData.statusDesc == "Success") {
        for (let location of res.body.responsePayloadData.locations) {
          let dates = location.imzAdditionalData
            .map((data) => data.availableDates)
            .flat(2);

          for (let date of dates) {
            let appointment = {
              address: `${location.addressLine} ${location.addressCityDescriptionText} ${location.addressState} ${location.addressZipCode}`,
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
    } catch (error) {
      console.log(error);
      errors.push(error);
    }
  }
  console.log(appointments);
  let body = mailUtil.getEmailBody(appointments, errors, allResponses);
  await mailUtil.sendEmail(
    "hello@benspowell.com",
    appointments.length + " Appointments Found",
    body
  );
};
exports.handler();
