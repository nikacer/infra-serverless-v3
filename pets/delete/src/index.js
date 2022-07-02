"use strict";
const { sendResponse, requestTransform } = require("../../../commons/response.class");
const {del} = require("../../../commons/dynamo.class")
const {processTOKEN} = require("../../../commons/utils.class")

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);

  const {body:{id}, headers} = requestTransform(event)
  const {email} = processTOKEN(headers)

  const params = {
    TableName: process.env.DYNAMODB_PETS_TABLE,
    Key: { id, emailUser: email},
  };
  console.info("params",params)
  const response = await del(params)
  sendResponse(200, response, callback);
};
