"use strict";
const { sendResponse } = require("../../../response.class");
const AWS = require("aws-sdk");

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);
  const { isBase64Encoded, body: bodyPlain } = event;
  const decodeBase64 = isBase64Encoded
    ? Buffer.from(bodyPlain, "base64").toString()
    : bodyPlain;
  const body = JSON.parse(decodeBase64);
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const putParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      email: body.email,
    },
  };
  try {
    await dynamoDb.put(putParams).promise();
    sendResponse(200, "ok lambda access", callback);
  } catch (err) {
    sendResponse(500, err, callback);
  }
};
