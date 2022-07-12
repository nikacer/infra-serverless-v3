"use strict";
const { sendResponse, requestTransform } = require("../../../commons/response.class");
const {processTOKEN} = require("../../../commons/utils.class")
const {scan} = require("../../../commons/dynamo.class")
const { v4: uuidv4 } =require("uuid");

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);
  const putParams = {
    TableName: process.env.DYNAMODB_ACTIVITIES_TABLE
  };
  console.info("putParams", putParams);

  const response = await scan(putParams)
  console.info("response DynamoDB", response)

  sendResponse(200, response , callback);
};
