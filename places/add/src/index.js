"use strict";
const {
  sendResponse,
  requestTransform,
} = require("../../../commons/response.class");
const { processTOKEN } = require("../../../commons/utils.class");
const { put } = require("../../../commons/dynamo.class");
const { v4: uuidv4 } = require("uuid");

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);
  const { body, headers } = requestTransform(event);

  const { email } = processTOKEN(headers);

  const putParams = {
    TableName: process.env.DYNAMODB_MOMENTS_TABLE,
    Item: {
      id: body.id ? body.id : uuidv4(),
      name: body.name,
      location: body.location,
      activity: body.activity,
      emailUser: email,
    },
    ReturnValues: "ALL_OLD",
  };

  console.info("putParams", putParams);

  await put(putParams);

  sendResponse(200, putParams, callback);
};
