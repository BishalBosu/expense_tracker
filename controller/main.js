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
		.then(user =>{
            res.json(user);
        })
		.catch(err => console.log(err))
}
