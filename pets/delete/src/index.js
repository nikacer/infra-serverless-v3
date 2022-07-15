"use strict";
const { sendResponse, requestTransform } = require("../../../commons/response.class");
const {update} = require("../../../commons/dynamo.class")
const {processTOKEN} = require("../../../commons/utils.class")

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);

  const {
    pathParameters: { id },
    headers,
  } = requestTransform(event);
  const {email} = processTOKEN(headers)

  const params = {
    TableName: process.env.DYNAMODB_PETS_TABLE,
    Key: { id, emailUser: email },
    ReturnValues: "ALL_NEW",
    UpdateExpression: "set #delete = :status",
    ExpressionAttributeNames: {
      "#delete": "delete",
    },
    ExpressionAttributeValues: {
      ":status": true
    }
  };
  console.info("params",params)
  const response = await update(params);
  sendResponse(200, response, callback);
};
