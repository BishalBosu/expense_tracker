const User = require("../model/registerdUsers")
const Expense = require("../model/expense")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sequelize = require("../util/database")
const Sib = require("sib-api-v3-sdk")
require('dotenv').config()

const client = Sib.ApiClient.instance;
//# Instantiate the client\
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SMTP_KEY;

var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
//# Define the campaign settings\
emailCampaigns.name = "Campaign sent via the API";
emailCampaigns.subject = "My subject";
emailCampaigns.sender = {"name": "From name", "email":"anshuman.kashyap@sendinblue.com"};
emailCampaigns.type = "classic";
//# Content that will be sent\

htmlContent: 'Congratulations! You successfully sent this example campaign via the Sendinblue API.',
//# Select the recipients\
recipients: {listIds: [2, 7]},
//# Schedule the sending in one hour\
scheduledAt: '2018-01-01 00:00:01'
}
//# Make the call to the client\
apiInstance.createEmailCampaign(emailCampaigns).then(function(data) {
console.log('API called successfully. Returned data: ' + data);
}, function(error) {
console.error(error);
});


//reset password
exports.postResetPass = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.body.email);
		
		
	} catch (err) {
		console.log(err);
		res.status(404).json({message: "Email Not Found"})

	}
}