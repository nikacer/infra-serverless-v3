"use strict";
const {
  sendResponse,
  requestTransform,
} = require("../../../commons/response.class");
const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

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

AWS.config.update({region:  process.env.REGION})

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);
  const { body } = requestTransform(event);
  try{
    const responseRegister = await registerUser(body)
    console.info("ResponseRegisterUser", responseRegister);
    sendResponse(responseRegister.statusCode, responseRegister, callback);
  }catch(err){
    sendResponse(err.statusCode,err, callback);
  }
};

function saveNewUser(){

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
  
}
async function registerUser(json) {
  const { email,password } = json;

  return new Promise((resolve, reject) => {
    let attributeList = [];

    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: email,
      })
    );

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    console.info("poolData",poolData)

    userPool.signUp(
      email,
      password,
      attributeList,
      null,
      function (err, result) {
        console.info("signUp Error", err),
        console.info("signUp result", result)
        if (err &&  err.statusCode) {
          return reject({
            statusCode: err.statusCode,
            code: err.code,
          });
        }

        resolve({
          statusCode: 200,
          message: "User successfully registered",
        });
      }
    );
  });
}




// userPool
//   .signUp(
//     body.email,
//     body.password,
//     attributeList,
//     null,
//     async (err, result) => {
//       if (err) throw err;
//       cognitoUser = result.user;
//       const responseDynamo = await dynamoDb.put(putParams).promise();
//       console.info("responseDynamo", responseDynamo);
//       sendResponse(
//         200,
//         { message: "success", user: cognitoUser.getUsername() },
//         callback
//       );
//     }
//   )
//   .promise();
