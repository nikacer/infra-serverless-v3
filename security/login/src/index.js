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
  const { body } = requestTransform(event);
  console.info("body", { ...body, password: body.password ? "****" : null });
  try {
    const {idToken:{jwtToken,payload:{email}}} = await authenticateUserResponse({ body });
    sendResponse(200,{jwtToken, payload:{email}} , callback);
  } catch (error) {
    sendResponse(500, error, callback);
  }
};

const authenticateUserResponse = ({
  body: { email: Username, password: Password },
}) =>
  new Promise((resolve, reject) => {
    const user = new AmazonCognitoIdentity.CognitoUser({
      Username,
      Pool: userPool,
    });

    const authenticationData = {
      Username,
      Password,
    };

    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    user.authenticateUser(authenticationDetails, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
