const Sib = require("sib-api-v3-sdk")
require("dotenv").config()

const client = Sib.ApiClient.instance
//# Instantiate the client\
const apiKey = client.authentications["api-key"]
apiKey.apiKey = process.env.SMTP_KEY;

var apiInstance = new Sib.TransactionalEmailsApi()



module.exports = apiInstance;