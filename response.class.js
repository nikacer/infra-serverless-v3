function sendResponse(statusCode, message, callback) {
  try {
    const response = {
      statusCode,
      body: JSON.stringify({
        message: message,
      }),
    };

    callback(null, response);
  } catch (err) {
    console.info("other ", err);
  }
}

module.exports = {
  sendResponse,
};
