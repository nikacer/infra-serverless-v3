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
  console.info("event", event);

  const { body, headers } = requestTransform(event);

  const responseLogout = await logout({headers})
  sendResponse(200, responseLogout.result,callback)
};

const logout = ({headers}) => new Promise((resolve,reject)=>{
  const payload = headers.Authorization.split(".")[1];
  const buff = Buffer.from(payload, 'base64');
  const str = JSON.parse(buff.toString("utf-8"));
  resolve({ statusCode: 200, result: { auth: headers.Authorization, str } });
})
