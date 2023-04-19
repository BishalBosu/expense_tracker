const User = require("../model/registerdUsers")
const Expense = require("../model/expense")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sequelize = require("../util/database")

exports.getLeaderBoardData = async (req, res, next) => {
	try {
		//using raw query
		// const newUserDataTable = await sequelize.query(
		// 	"SELECT name, SUM(amount) AS totalAmount FROM users JOIN expenses ON users.email=expenses.userEmail GROUP BY users.email ORDER by totalAmount DESC"
		// )

		const newUserDataTable = await sequelize.query("SELECT name, totalAmount From users ORDER by totalAmount DESC")

		res.json(newUserDataTable[0])
	} catch (err) {
		console.log("sqlerror in controller: ", err)
	}
}
