const User = require("../model/registerdUsers")

exports.postRegUsers = (req, res, next) => {
	const email = req.body.email
	const name = req.body.name
	const password = req.body.password

	User.create({
		email: email,
		name: name,
		password: password,
	})
		.then((user) => {
			res.json(user)
		})
		.catch((err) => res.json(err))
}

exports.postLogIn = (req, res, next) => {
	let email = req.body.email
	const password = req.body.password

	User.findByPk(email)
		.then(user=>{	
			const real_password = user.password;

			if(password != real_password){
				email = "password not matched";
			}		

			obj={
				email
			}
			return res.json(obj);
		})
		.catch((err) => {
			email = "not found"
			obj = {
				email
			}
			return res.json(obj);
		})
}
