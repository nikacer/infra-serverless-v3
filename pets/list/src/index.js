"use strict";
const {scan} = require("../../../commons/dynamo.class");
const {processTOKEN} = require("../../../commons/utils.class")
const {sendResponse} = require("../../../commons/response.class")


module.exports.handler = async (event, context, callback) => {
  console.info("event", event);

  const { email } = processTOKEN(event.headers)
 const params = {
   TableName: process.env.DYNAMODB_PETS_TABLE,
   FilterExpression: "#emailUser = :email and #delete= :status",
   ExpressionAttributeValues: { ":email": email,":status":false},
   ExpressionAttributeNames: {
     "#emailUser": "emailUser",
     "#delete":"delete"
   },
 };
  console.info("params", params)

 try {
    const {data} = await scan(params);
    console.info(data);

    sendResponse(200, data, callback);
 } catch (error) {
   console.error(error)
   sendResponse(500, "error encontrado :(", callback);
 }
};
