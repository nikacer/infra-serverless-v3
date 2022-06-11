"use strict";
const { sendResponse } = require("../../../response.class");

module.exports.handler = async (event, context, callback) => {
  console.info("event", event);
  sendResponse(200, "ok lambda logout", callback);
};
