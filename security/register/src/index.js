"use strict";
const {
  sendResponse,
  requestTransform,
} = require("../../../commons/response.class");
const AWS = require("aws-sdk");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { put } = require("../../../commons/dynamo.class");
const { object, string, date, ref } = require("yup");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * config cognito
 */

const poolData = {
  UserPoolId: process.env.USER_POOL_ID, // Your user pool id here
  ClientId: process.env.SERVER_COGNITO_ID, // Your client id here
};

AWS.config.update({ region: process.env.REGION });

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const requestValidator = object({
  email: string()
    .email("Debe ser un correo corrécto")
    .required("Email requerido"),
  firstName: string().required("Nombres requeridos"),
  lastName: string().required("Apellidos requeridos"),
  birthDate: date("debe ser AAA/MM.DD")
    .required("Fecha nacimiento requerida"),
  gender: string().required("Genero requerido"),
  password: string()
    .min(6, "Contraseña debe ser mínimo de 6 carácteres")
    .required("Contraseña necesaria"),
  retryPassword: string().oneOf(
    [ref("password"), null],
    "Contraseñas no coinciden"
  ).required(),
});

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);
  const { body } = requestTransform(event);

  try {
    await requestValidator.validate(body).catch(({ message }) => {
      sendResponse(500, { message }, callback);
    });
    const responseRegister = await registerUser(body);
    console.info("ResponseRegisterUser", responseRegister);
    sendResponse(responseRegister.statusCode, responseRegister, callback);
  } catch (err) {
    sendResponse(err.statusCode, err, callback);
  }
};

function saveNewUser(body) {
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

  return put(putParams);
}

async function registerUser(json) {
  const { email, password } = json;

  return new Promise((resolve, reject) => {
    let attributeList = [];

    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: email,
      })
    );

    userPool.signUp(
      email,
      password,
      attributeList,
      null,
      async function (err, result) {
        console.info("signUp Error", err),
          console.info("signUp result", result);
        if (err && err.statusCode) {
          return reject({
            statusCode: err.statusCode,
            code: err.code,
          });
        }

        const dynamoResponse = await saveNewUser(json);

        console.info(dynamoResponse);

        resolve({
          statusCode: 200,
          message: "User successfully registered",
        });
      }
    );
  });
}
