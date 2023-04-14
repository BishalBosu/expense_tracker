const express = require("express")

const path = require("path")

const bodyParser = require("body-parser")
const sequelize = require("./util/database")

const mainRoutes = require("./routers/main")

const cors = require("cors")

const app = express()

app.use(cors())
app.use(bodyParser.json({ extended: false }))

app.use(mainRoutes)

sequelize
	.sync()
	.then((result) => {
		app.listen(3006)
	})
	.catch((err) => console.log("DbErroRRR: ", err))

