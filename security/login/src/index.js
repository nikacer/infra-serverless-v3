"use strict";
const {
  sendResponse,
  requestTransform,
} = require("../../../commons/response.class");
const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: process.env.USER_POOL_ID, // Your user pool id here
  ClientId: process.env.SERVER_COGNITO_ID, // Your client id here
};

AWS.config.update({ region: process.env.REGION });
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.handler = async (event, context, callback) => {
  const {body} = requestTransform(event)

  const user = new AmazonCognitoIdentity.CognitoUser({
    Username: body.email,
    Pool: userPool,
  });

  console.info("body", body);
  console.info("userPool", userPool);

  const authenticationData = {
    Username: body.email,
    Password: body.password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );

  user.authenticateUser(authenticationDetails, {
    onSuccess: (result) => sendResponse(200, result, callback),
    onFailure: (err) => sendResponse(500, err, callback),
  });

};
