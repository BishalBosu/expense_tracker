const User = require("../model/registerdUsers")
const Expense = require("../model/expense")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sequelize = require("../util/database")



exports.postRegUsers = async (req, res, next) => {
	//transaction constant
	const t = await sequelize.transaction()
	const email = req.body.email
	const name = req.body.name
	const password = req.body.password

	try {
		bcrypt.hash(password, 10, async (err, hash) => {
			if (err) console.log(err)
			const user = await User.create(
				{
					email: email,
					name: name,
					password: hash,
					is_premium: false,
					totalAmount: 0,
				},
				{ transaction: t }
			)

			await t.commit()
			res.json(user)
		})
	} catch (err) {
		await t.rollback()
		//indicating conflict by 409
		res.status(409).json(err)
	}
}

exports.postLogIn = (req, res, next) => {
	let email = req.body.email
	const password = req.body.password

	User.findByPk(email)
		.then((user) => {
			const hashed_password = user.password
			const name = user.name
			const is_premium = user.is_premium

			bcrypt.compare(password, hashed_password, async (err, result) => {
				if (err) {
					email = "something went wrong"

					obj = {
						email,
					}
					return res.status(500).json(obj)
				}

				if (result) {
					const token = generateAcessToken(email, name, is_premium)
					obj = {
						email,
						token,
					}
					return res.json(obj)
				} else {
					email = "password not matched"
					obj = {
						email,
					}
					return res.status(401).json(obj)
				}
			})
		})
		.catch((err) => {
			email = "not found"
			obj = {
				email,
			}
			return res.status(404).json(obj)
		})
}
//adding expenses
exports.postAddItem = async (req, res, next) => {
	//transaction constant
	const t = await sequelize.transaction()

	const token = req.body.token

	const user = jwt.verify(token, process.env.TOKEN_PRIVATE_KEY)

	const amount = req.body.amount
	const desc = req.body.desc
	const type = req.body.type

	try {
		const item = await Expense.create(
			{
				amount: amount,
				desc: desc,
				type: type,
				userEmail: user.userEmail,
			},
			{ transaction: t }
		)

		res.json(item)

		const user1 = await User.findByPk(user.userEmail)

		const newAmount = user1.totalAmount + +amount
		await user1.update({ totalAmount: newAmount }, { transaction: t })
		await t.commit()
	} catch (err) {
		await t.rollback()
		console.log(err)
	}
}

exports.getAllItems = async (req, res, next) => {
	try {
		const items = await req.user.getExpenses()
		res.json(items)
	} catch (err) {
		console.log(err)
	}
}

exports.deleteItem = async (req, res, next) => {
	//transaction constant
	const t = await sequelize.transaction()

	id = req.params.itemId

	try {
		const item = await Expense.findByPk(id)

		const user = await User.findByPk(item.userEmail)

		//transaction constant
		const t = await sequelize.transaction()
		const newAmount = user.totalAmount - +item.amount
		await user.update({ totalAmount: newAmount }, { transaction: t })
		item.destroy()
		await t.commit()
		return res.json({})
	} catch (err) {
		await t.rollback()
		console.log("LOWWWDLETE", err)
	}
}



function generateAcessToken(email, name, is_premium) {
	return jwt.sign(
		{ userEmail: email, name: name, is_premium: is_premium },
		process.env.TOKEN_PRIVATE_KEY
	)
}
