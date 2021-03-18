const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
var ses = new AWS.SES({ region: "us-east-1" });

exports.sendEmail = function (address, subject, body) {
  var params = {
    Destination: { ToAddresses: [address] },
    Message: {
      Body: { Html: { Data: body } },
      Subject: { Data: subject },
    },
    Source: "vax-notifications@benspowell.com",
  };
  return ses.sendEmail(params).promise();
};

exports.getEmailBody = function (appointments, errors, allResponses) {
  return `
    <h1>Appointment Data</h1>
    <div>
        ${
        appointments.length > 0
            ? appointments
                .map(
                (el) =>
                    `<h3>CVS Appointment</h3><p>${el.address}</p><p>${el.date}</p>`
                )
                .join("")
            : "No Appointments"
        }
    </div>
    
    <h2>Errors</h2>
    <div>
        ${JSON.stringify({ errors: errors })}
    </div>
    
    <h2>All Responses</h2>
    <div>
        ${JSON.stringify({ all_responses: allResponses })}
    </div>
    `;
};
