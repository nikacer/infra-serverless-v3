"use strict";
const {
  sendResponse,
  requestTransform,
} = require("../../../commons/response.class");
const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const util = require("util");

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * config cognito
 */

const poolData = {
  UserPoolId: process.env.USER_POOL_ID, // Your user pool id here
  ClientId: process.env.SERVER_COGNITO_ID, // Your client id here
};
console.log(JSON.stringify(poolData, null, 10));

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.handler = (event, context, callback) => {
  console.info("event", event);

  const { body } = requestTransform(event);
  //////

  const attributeList = [];
  attributeList.push(
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "email",
      Value: body.email,
    })
  );

  attributeList.push(
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "custom:scope",
      Value: "user",
    })
  );

  ///////
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
    userPool.signUp(
      body.email,
      body.password,
      attributeList,
      null,
      async (err, result) => {
        if (err) throw err;
        cognitoUser = result.user;
        const responseDynamo = await dynamoDb.put(putParams).promise();
        console.info("responseDynamo", responseDynamo);
        sendResponse(
          200,
          { message: "success", user: cognitoUser.getUsername() },
          callback
        );
      }
    );
  } catch (error) {
    sendResponse(500, { error }, callback);
  }
};
