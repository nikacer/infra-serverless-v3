const AWS = require("aws-sdk");
const mylocalAuthProxyFn = async (event, context) => {
  const lambda = new AWS.Lambda();
  const result = await lambda
    .invoke({
      FunctionName: "my-shared-lambda-authorizer",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(event),
    })
    .promise();

  if (result.StatusCode === 200) {
    return JSON.parse(result.Payload);
  }

  throw Error("Authorizer error");
};

module.exports = { mylocalAuthProxyFn };
