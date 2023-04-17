const User = require("../model/registerdUsers")
const Expense = require("../model/expense")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

exports.postRegUsers = (req, res, next) => {
	const email = req.body.email
	const name = req.body.name
	const password = req.body.password

	bcrypt.hash(password, 10, async (err, hash) => {
		if (err) console.log(err)
		await User.create({
			email: email,
			name: name,
			password: hash,
			is_premium: false
		})
			.then((user) => {
				res.json(user)
			})
			.catch((err) => res.status(409).json(err))
	})
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
					email = "something went wrong";
					
					obj = {
						email,
					}
					return res.status(500).json(obj)
				}

				if (result) {
					const token = generateAcessToken(email, name, is_premium);
					obj = {
						email,
						token						
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

exports.postAddItem = (req, res, next) => {
	const token = req.body.token;

	const user = jwt.verify(token, process.env.TOKEN_PRIVATE_KEY)

	const amount = req.body.amount
	const desc = req.body.desc
	const type = req.body.type

	Expense.create({
		amount: amount,
		desc: desc,
		type: type,
		userEmail: user.userEmail
	})
		.then((item) => {
			res.json(item)
		})
		.catch((err) => console.log(err))
}

exports.getAllItems = (req, res, next) => {
	req.user.getExpenses()
		.then((items) => res.json(items))
		.catch((err) => console.log(err))
}

exports.deleteItem = (req, res, next) => {
	id = req.params.itemId

	Expense.findByPk(id)
		.then(item =>{
			item.destroy();
			return res.json({})
		})
		.catch((err) => console.log(err))
}


function generateAcessToken(email, name, is_premium){
	return jwt.sign({userEmail: email, name: name, is_premium: is_premium}, process.env.TOKEN_PRIVATE_KEY);
}

