const express = require("express")

const path = require("path")

const bodyParser = require("body-parser")
const sequelize = require("./util/database")

const mainRoutes = require("./routers/main")
const buyRoutes = require("./routers/buy")
const premiumRoutes = require("./routers/premium")

const User = require('./model/registerdUsers');
const Expense = require('./model/expense')
const Order = require('./model/order')

const cors = require("cors")

const app = express()

app.use(cors())
app.use(bodyParser.json({ extended: false }))

app.use(mainRoutes)
app.use('/buy', buyRoutes)
app.use(premiumRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

sequelize
	.sync()
	.then((result) => {
		app.listen(3006)
	})
	.catch((err) => console.log("DbErroRRR: ", err))


	