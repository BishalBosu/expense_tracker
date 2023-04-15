const jwt = require("jsonwebtoken")
const User = require("../model/registerdUsers")

exports.authenticate = (req, res, next) => {
	try {
		const token = req.header("Authorization")
		console.log(token)
		const user = jwt.verify(token, "asdf123")
		User.findByPk(user.userEmail)
			.then((userInstance) => {
				req.user = userInstance;
                next();
			})
			.catch((err) => {throw new Error(err)})
	} catch (err) {
        console.log(err);
        return res.status(401).json({succ: false})
    }
}

