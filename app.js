const express = require("express")

const path = require("path")

const bodyParser = require("body-parser")
const sequelize = require("./util/database")

const mainRoutes = require("./routers/main")

const User = require('./model/registerdUsers');
const Expense = require('./model/expense')

const cors = require("cors")

const app = express()

app.use(cors())
app.use(bodyParser.json({ extended: false }))

app.use(mainRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)


sequelize
	.sync()
	.then((result) => {
		app.listen(3006)
	})
	.catch((err) => console.log("DbErroRRR: ", err))

