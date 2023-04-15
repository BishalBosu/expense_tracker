const User = require("../model/registerdUsers")
const bcrypt = require("bcrypt")

exports.postRegUsers = (req, res, next) => {
	const email = req.body.email
	const name = req.body.name
	const password = req.body.password

	bcrypt.hash(password, 10, async (err, hash) => {
		if (err) console.log(err)
		await User.create({
			email: email,
			name: name,
			password: hash
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

			bcrypt.compare(password, hashed_password, async (err, result)=>{
				if(err){
					email = "something went wrong"
					obj = {
						email,
					}
					return res.status(500).json(obj)
					}

					if(result){
						obj = {
							email,
						}
						return res.json(obj)
					}
					
					else{
						email = "password not matched"
					obj = {
						email,
					}
					return res.status(401).json(obj)
					}
				}			
			)

		})
		.catch((err) => {
			email = "not found"
			obj = {
				email,
			}
			return res.status(404).json(obj)
		})
}
