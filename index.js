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
      // let res = await cvsApi.getAppointmentsNearZipCode(zipCode);
      let res = {
        body: {
          responseMetaData: {
            statusCode: "0000",
            statusDesc: "Success",
            conversationID: "Id-442c516051852a4cb5f2723d",
            refId: "Id-442c516051852a4cb5f2723d",
          },
          responsePayloadData: {
            schedulerRefType: "IMZ_STORE",
            availableDates: [
              "2021-03-17",
              "2021-03-18",
              "2021-03-19",
              "2021-03-20",
            ],
            locations: [
              {
                StoreNumber: "04447",
                minuteClinicID: "0",
                opticalClinicID: "0",
                storeType: 0,
                covaxInd: "Y",
                pharmacyNCPDPProviderIdentifier: "3661762",
                addressLine: "900 BELLEFONTAINE RD",
                addressCityDescriptionText: "LIMA",
                addressState: "OH",
                addressZipCode: "45804",
                addressCountry: "US",
                geographicLatitudePoint: "40.737000",
                geographicLongitudePoint: "-84.090500",
                indicatorStoreTwentyFourHoursOpen: "N",
                indicatorPrescriptionService: "Y",
                indicatorPhotoCenterService: "N",
                indicatorMinuteClinicService: "N",
                indicatorOpticalService: "N",
                instorePickupService: "Y",
                indicatorDriveThruService: "N",
                indicatorPharmacyTwentyFourHoursOpen: "N",
                rxConvertedFlag: "Y",
                indicatorCircularConverted: "Y",
                indicatorH1N1FluShot: "N",
                indicatorRxFluFlag: "N",
                indicatorWicService: "Y",
                snapIndicator: "Y",
                indicatorVaccineServiceSupport: "N",
                indicatorPneumoniaShotService: "N",
                indicatorWeeklyAd: "Y",
                indicatorCVSStore: "Y",
                indicatorStorePickup: "N",
                storeLocationTimeZone: "EDT",
                storePhonenumber: "4192277970",
                pharmacyPhonenumber: "4192277970",
                storeHours: {
                  DayHours: [
                    {
                      Day: "MON",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "TUE",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "WED",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "THU",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "FRI",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "SAT",
                      Hours: "10:00 AM - 06:00 PM",
                    },
                    {
                      Day: "SUN",
                      Hours: "10:00 AM - 05:00 PM",
                    },
                  ],
                },
                pharmacyHours: {
                  DayHours: [
                    {
                      Day: "MON",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "TUE",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "WED",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "THU",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "FRI",
                      Hours: "09:00 AM - 08:00 PM",
                    },
                    {
                      Day: "SAT",
                      Hours: "10:00 AM - 06:00 PM",
                    },
                    {
                      Day: "SUN",
                      Hours: "10:00 AM - 05:00 PM",
                    },
                  ],
                },
                adVersionCdCurrent: "H",
                adVersionCdNext: "H",
                distance: "1.86",
                immunizationAvailability: {
                  available: ["CVD"],
                  unavailable: [],
                },
                schedulerRefId: "CVS_04447",
                imzAdditionalData: [
                  {
                    imzType: "CVD",
                    availableDates: ["2021-03-17"],
                  },
                ],
                mfrName: "Pfizer",
                additionalDoseRequired: "Y",
              },
            ],
          },
        },
      };
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
  console.log(body);
  await mailUtil.sendEmail(
    "hello@benspowell.com",
    appointments.length + " Appointments Found",
    body
  );
};
exports.handler();
