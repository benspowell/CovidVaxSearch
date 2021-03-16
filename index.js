require("dotenv").config();
const unirest = require("unirest");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.handler = async (event, context, callback) => {};