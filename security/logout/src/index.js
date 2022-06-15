"use strict";
const {
  sendResponse,
  requestTransform,
} = require("../../../commons/response.class");
const AWS = require("aws-sdk");

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

const UserPoolId = process.env.USER_POOL_ID;

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);

  const { body } = requestTransform(event);

  var params = {
    UserPoolId,
    Username: body.email /* required */,
  };
  cognito.adminUserGlobalSignOut(params, function (err, data) {
    if (err) sendResponse(500, err, callback);
    else sendResponse(200, data, callback);
  });
};
