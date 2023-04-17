const Razorpay = require("razorpay")
const Order = require("../model/order")
const User = require("../model/registerdUsers")
const jwt = require('jsonwebtoken')


exports.buyPremium = (req, res, next) => {
	try {
		var rzp = new Razorpay({
			key_id: process.env.RZP_KEY_ID,
			key_secret: process.env.RZP_KEY_SECRET,
		})
		const amount = 2500

		rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
			if (err) {
				throw new Error(JSON.stringify(err))
			}

			req.user
				.createOrder({ orderId: order.id, status: "PENDING" })
				.then(() => {
					return res.status(201).json({ order, key_id: rzp.key_id })
				})
				.catch((err) => {
					throw new Error(JSON.stringify(err))
				})
		})
	} catch (err) {
		console.log(err)
		res.status(403).json({ message: "Something broken", error: err })
	}
}

exports.updateTransaction = (req, res, next) => {
	try {
		const { payment_id, order_id, name, email } = req.body
		//console.log("uptrans contr", req.body)

		Promise.all([
			Order.findOne({ where: { orderId: order_id } }),
			req.user.update({ is_premium: true })
			
			
		])
			.then((values) => {
				values[0].update({ paymentId: payment_id, status: "SUCESSFUL" })
				return res
				.status(202)
				.json({ sucess: true, message: "Transaction Sucessfull!", token: generateAcessToken(email, name, true) })

				
			})
			.catch((err) => {
				throw new Error(err)
			})

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
	} catch (err) {
		console.log(err)
		res
			.status(403)
			.json({ message: "Something broken in updateTransaction", error: err })
	}
}

function generateAcessToken(email, name, is_premium){
	return jwt.sign({userEmail: email, name: name, is_premium: is_premium}, process.env.TOKEN_PRIVATE_KEY);
}