"use strict";
const { sendResponse } = require("../../../commons/response.class");
const {scan} = require("../../../commons/dynamo.class")


module.exports.handler = async (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_MOMENTS_TABLE,
  };
  const momentsResponse = await scan(params)
  sendResponse(200, momentsResponse, callback);
};
