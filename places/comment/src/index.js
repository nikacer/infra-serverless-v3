"use strict";
const { sendResponse, requestTransform } = require("../../../commons/response.class");
const {update} = require("../../../commons/dynamo.class")
const { processTOKEN } = require("../../../commons/utils.class");


module.exports.handler = async (event, context, callback) => {
  console.info("event", event);

  const {body:{comment, rate}, pathParameters:{id},headers} = requestTransform(event)
  const { email } = processTOKEN(headers);


  const params = {
    TableName: process.env.DYNAMODB_MOMENTS_TABLE,
    Key: {
      id,
    },
    ReturnValues: "ALL_NEW",
    UpdateExpression:
      "set #comments = list_append(if_not_exists(#comments, :empty_list), :comment)",
    ExpressionAttributeNames: {
      "#comments": "comments",
    },
    ExpressionAttributeValues: {
      ":comment": [
        {
          comment,
          rate,
          email,
          create: Math.floor(+new Date() / 1000),
          update: Math.floor(+new Date() / 1000),
        },
      ],
      ":empty_list": [],
    },
  };
  console.info(JSON.stringify(params.ExpressionAttributeValues[":comment"]));
  const response = await update(params)

  sendResponse(200, response, callback);
};
