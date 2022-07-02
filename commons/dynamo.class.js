const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function put(params) {
    console.info("dynamo::class::putParams", params);
    return dynamoDb.put(params).promise();
}

async function get(params){
    try {
    const data = await dynamoDb.get(params).promise()
    return {data}
  } catch (err) {
    return {err}
  }
}

async function query(params){
   try {
     const data = await dynamoDb.scan(params).promise();
     return { data };
   } catch (err) {
     return { err };
   }
}

module.exports = {
    put,
    get, 
    query
}
