const processTOKEN = (headers) => {
    const payload = headers.Authorization.split(".")[1];
    const buff = Buffer.from(payload, "base64");
    const token = JSON.parse(buff.toString("utf-8"));
    console.info("currentToken", token);
    return token;
}

module.exports = {
    processTOKEN
}