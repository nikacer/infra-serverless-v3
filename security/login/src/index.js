"use strict";
const {
  sendResponse,
  requestTransform,
} = require("../../../commons/response.class");
const AWS = require("aws-sdk");

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);

  const { body } = requestTransform(event);
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const putParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      email: body.email,
    },
  };
  try {
    // await dynamoDb.put(putParams).promise();
    sendResponse(200, "ok lambda access", callback);
  } catch (err) {
    sendResponse(500, err, callback);
  }
};
