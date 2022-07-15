"use strict";
const { sendResponse, requestTransform } = require("../../../commons/response.class");
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
  console.info("body",body)

  try{
    if(!body.code) throw { statusCode: 500, error: "campo vacío" };
    const {statusCode,result} = await confirmRegistrationResponse({body})
    sendResponse(statusCode, result, callback);

  } catch({statusCode, error}){
    sendResponse(statusCode, error, callback);
  }
  
};

const confirmRegistrationResponse = ({body}) => new Promise((resolve,reject)=>{

  const user = new AmazonCognitoIdentity.CognitoUser({
    Username: body.email,
    Pool: userPool,
  });

  console.info("userPool", userPool);
  user.confirmRegistration(body.code, true, (error, result) => {
    console.info("Response", { error, result });
    if (error) reject({statusCode: 500, error})
    resolve({ statusCode: 200, result });
  });
})
