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

function requestTransform(event) {
  const { isBase64Encoded, body: bodyPlain } = event;
  const decodeBase64 = isBase64Encoded
    ? Buffer.from(bodyPlain, "base64").toString()
    : bodyPlain;
  const body = JSON.parse(decodeBase64);

  return { ...event, body };
}

module.exports = {
  sendResponse,
  requestTransform,
};
