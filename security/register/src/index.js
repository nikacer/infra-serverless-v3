"use strict";
const { sendResponse, requestTransform } = require("../../../response.class");
const AWS = require("aws-sdk");

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const USERPOOLID = process.env.USER_POOL_ID;
module.exports.handler = async (event, context, callback) => {
  console.info("event", event);
  const { body } = requestTransform(event);

  const cognitoParams = {
    UserPoolId: USERPOOLID,
    Username: body.email,
    UserAttributes: [
      {
        Name: "email",
        Value: body.email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    TemporaryPassword: body.password,
  };

  console.info("cognitoParams", cognitoParams);

  const putParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      birthDate: body.birthDate,
      gender: body.gender,
    },
  };

  console.info("putParams", putParams);

  try {
    const responseCognito = await cognito
      .adminCreateUser(cognitoParams)
      .promise();
    console.info("responseCognito", responseCognito);

    const responseDynamo = await dynamoDb.put(putParams).promise();

    console.info("responseDynamo", responseDynamo);

    sendResponse(200, { message: "success" }, callback);
  } catch (error) {
    sendResponse(500, { error }, callback);
  }
};
