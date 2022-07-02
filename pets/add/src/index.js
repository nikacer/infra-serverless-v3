"use strict";
const { sendResponse, requestTransform } = require("../../../commons/response.class");
const {processTOKEN} = require("../../../commons/utils.class")
const {put} = require("../../../commons/dynamo.class")
const { v4: uuidv4 } =require("uuid");

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);
  const { body, headers } = requestTransform(event);

  const {email} = processTOKEN(headers)

  const putParams = {
    TableName: process.env.DYNAMODB_PETS_TABLE,
    Item: {
      id: body.id? body.id : uuidv4(),
      size: body.size,
      ageRange: body.ageRange,
      breed: body.breed,
      emailUser: email,
    },
  };
  console.info("putParams", putParams);

  const response = await put(putParams)
  console.info("response DynamoDB", response)

  sendResponse(200, response , callback);
};
