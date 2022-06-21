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
    const response = await authenticateUserResponse({ body });
    console.info("response auth ", response);
    sendResponse(200, response, callback);
  } catch (error) {
    sendResponse(500, error, callback);
  }
};

const authenticateUserResponse = ({
  body: { email: Username, password: Password },
}) =>
  new Promise((resolve, reject) => {
    console.info("request", { Username, Password: Password ? "*****" : null });

    const user = new AmazonCognitoIdentity.CognitoUser({
      Username,
      Pool: userPool,
    });

    console.info("userPool", userPool);

    const authenticationData = {
      Username,
      Password,
    };

    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    console.info("authenticationDetails", authenticationDetails);

    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.info("result authtenticate ", result);
        resolve({ statusCode: 200, result });
      },
      onFailure: (error) => {
        console.info("error authtenticate ", error);
        reject({ statusCode: 500, error });
      },
    });
  });
