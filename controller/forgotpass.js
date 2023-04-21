const User = require("../model/registerdUsers")
const apiInstance = require("../util/smtp_sib")

//reset password
exports.postResetPass = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.body.email)
		const sender = {
			email: "bishalbosu@gmail.com",
		}

		const recever = [{ email: user.email }]

		await apiInstance
			.sendTransacEmail({
				sender,
				to: recever,
				subject: "Reset Your Password",
				textContent: "Reset your link from here.",
			})
			.then(() =>
				res.json({ sucess: true, message: "email sent successfully!" })
			)
			.catch((err) => {
				res.json({ sucess: false, message: "SIB Internal server error"});
				console.log("upper", err)
			})
	} catch (err) {
		console.log("lower", err)
		res.status(404).json({ sucess: false, message: "Email Not Found" })
	}
}
