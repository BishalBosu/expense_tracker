const User = require("../model/registerdUsers")
const apiInstance = require("../util/smtp_sib")
const ForgotPassReq = require("../model/forgot_pass_req")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")

//reset password
exports.postForgotPass = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.body.email)
		const sender = {
			email: "bishalbosu@gmail.com",
		}
		//generating new uuid
		const uuid = uuidv4()

		await ForgotPassReq.create({
			id: uuid,
			userEmail: user.email,
			isactive: true,
		})

		const recever = [{ email: user.email }]

		await apiInstance.sendTransacEmail({
			sender,
			to: recever,
			subject: "Reset Your Password",
			textContent: "Reset your link from here.",
			htmlContent: `http://localhost:3006/password/resetpassword/${uuid}`
		})
		res.json({ sucess: true, message: "email sent successfully!" })
	} catch (err) {
		res.status(404).json({
			sucess: false,
			message: "Email Not Found or something went wrong in internal server."
		})
	}
}


exports.resetPassForm = async (req, res, next) => {
	const uuid = req.params.uuid;

	const ForgotRequest = await ForgotPassReq.findByPk(uuid);

	if(ForgotRequest.isactive){
		return res.sendFile(__dirname + '../view/reset_pass_form.html');
	}

	res.status(402).json({message: "Link in Diabled!"})

}

exports.postUpdatePass = async (req, res, next) => {
	const password = req.body.password;

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