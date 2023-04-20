const Razorpay = require("razorpay")
const Order = require("../model/order")
//sconst User = require("../model/registerdUsers")
const jwt = require("jsonwebtoken")
const sequelize = require("../util/database")

exports.buyPremium = async (req, res, next) => {
	//transaction constant
	const t = await sequelize.transaction()
	try {
		var rzp = new Razorpay({
			key_id: process.env.RZP_KEY_ID,
			key_secret: process.env.RZP_KEY_SECRET,
		})
		const amount = 2500

		await rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
			if (err) {
				throw new Error(JSON.stringify(err))
			}

			try {
				await req.user.createOrder(
					{ orderId: order.id, status: "PENDING" },
					{ transaction: t }
				)

				await t.commit()
				return res.status(201).json({ order, key_id: rzp.key_id })
			} catch (err) {
				await t.rollback()
				throw new Error(JSON.stringify(err))
			}
		})
	} catch (err) {
		console.log(err)
		res.status(403).json({ message: "Something broken", error: err })
	}
}

exports.updateTransaction = async (req, res, next) => {
	//transaction constant
	const t = await sequelize.transaction()

	try {
		const { payment_id, order_id, name, email } = req.body
		//console.log("uptrans contr", req.body)

		const values = await Promise.all([
			Order.findOne({ where: { orderId: order_id } }),
			req.user.update({ is_premium: true }, { transaction: t }),
		])

		await values[0].update(
			{ paymentId: payment_id, status: "SUCESSFUL" },
			{ transaction: t }
		)

		await t.commit()

		return res.status(202).json({
			sucess: true,
			message: "Transaction Sucessfull!",
			token: generateAcessToken(email, name, true),
		})
	} catch (err) {
		await t.rollback()

		console.log(err)
		res
			.status(403)
			.json({ message: "Something broken in updateTransaction", error: err })
	}

	// Order.findOne({ where: { orderId: order_id } })
	// 	.then((order) => {
	// 		order
	// 			.update({ paymentId: payment_id, status: "SUCESSFUL" })
	// 			.then(() => {
	// 				req.user
	// 					.update({ is_premium: true })
	// 					.then(() => {
	// 						return res
	// 							.status(202)
	// 							.json({ sucess: true, message: "Transaction Sucessfull!" })
	// 					})
	// 					.catch((err) => {
	// 						throw new Error(err)
	// 					})
	// 			})
	// 			.catch((err) => {
	// 				throw new Error(err)
	// 			})
	// 	})
	// 	.catch((err) => {
	// 		throw new Error(err)
	// 	})
}

function generateAcessToken(email, name, is_premium) {
	return jwt.sign(
		{ userEmail: email, name: name, is_premium: is_premium },
		process.env.TOKEN_PRIVATE_KEY
	)
}
