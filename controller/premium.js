const DowUrl = require("../model/downloadurl")
const sequelize = require("../util/database")
const AWS = require("aws-sdk")
require("dotenv").config()

//for downloadreport below
async function uploadToS3Cloud(data, filename) {
	const BUCKET_NAME = "datareportgenerated"
	const IAM_USER_KEY = process.env.IAM_USER_KEY
	const IAM_USER_SECRET = process.env.IAM_USER_SECRET

	let s3bucket = new AWS.S3({
		accessKeyId: IAM_USER_KEY,
		secretAccessKey: IAM_USER_SECRET,
	})

	var params = {
		Bucket: BUCKET_NAME,
		Key: filename,
		Body: data,
		ACL: "public-read",
	}

	return new Promise((resolve, reject) => {
		s3bucket.upload(params, (err, s3response) => {
			if (err) {
				console.log("something went wrong", err)
				reject(err)
			} else {
				console.log("sucess", s3response)
				resolve(s3response.Location)
			}
		})
	})
}

exports.getLeaderBoardData = async (req, res, next) => {
	try {
		//using raw query
		// const newUserDataTable = await sequelize.query(
		// 	"SELECT name, SUM(amount) AS totalAmount FROM users JOIN expenses ON users.email=expenses.userEmail GROUP BY users.email ORDER by totalAmount DESC"
		// )

		const newUserDataTable = await sequelize.query(
			"SELECT name, totalAmount From users ORDER by totalAmount DESC"
		)

		res.json(newUserDataTable[0])
	} catch (err) {
		console.log("sqlerror in controller: ", err)
	}
}

exports.downloadreport = async (req, res, next) => {
	try {
		const expenses = await req.user.getExpenses();
		const string_expenses = JSON.stringify(expenses);
		const filename = `Expenses-${req.user.email}-${new Date()}.txt`;
		const file_url = await uploadToS3Cloud(string_expenses, filename);
		//console.log(file_url);

		await DowUrl.create({
			fileurl: file_url,
			userEmail: req.user.email
		})

		res.json({ fileUrl: file_url, sucess: true })
	} catch (err) {
		res.status(500).json({ fileUrl: "", message: "file download cant be done now!", success: false })
	}
}
