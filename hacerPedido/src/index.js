"use strict";

const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const { sendResponse } = require("../../response.class");
var sqs = new AWS.SQS();
const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;

module.exports.handler = async (event, context, callback) => {
  try {
    const orderId = v4();
    const params = {
      MessageBody: JSON.stringify({ orderId }),
      QueueUrl: QUEUE_URL,
    };
    console.info("params queue", params);
    // sendResponse(200, { orderId }, callback);

    sqs.sendMessage(params, function (err, data) {
      try {
        console.info("status sqs", err, data);
        if (err) {
          console.info("error response sendMessage", err);
          sendResponse(500, err, callback);
        } else {
          console.info("ok sendMessage", data);
          sendResponse(200, { orderId, data }, callback);
        }
      } catch (err) {
        console.info("error sendMessage", err);
        sendResponse(500, err, callback);
      }
    });
  } catch (err) {
    console.info("Fatal Error ->", err);
    sendResponse(500, err, callback);
  }
};
