require("dotenv").config()
const express = require("express")

const path = require("path")
const fs = require("fs")

const bodyParser = require("body-parser")
const sequelize = require("./util/database")

const mainRoutes = require("./routers/main")
const buyRoutes = require("./routers/buy")
const premiumRoutes = require("./routers/premium")
const fogotpassRoutes = require("./routers/forgotpass")

const User = require('./model/registerdUsers');
const Expense = require('./model/expense')
const Order = require('./model/order')
const ForgotPassReq = require('./model/forgot_pass_req')
const DowUrl = require('./model/downloadurl')
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")

const cors = require("cors")

const app = express();

app.use(express.static(path.join(__dirname, "public")))

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, "access.log"),
	{flags: 'a'}
)
	
	


app.use(helmet());
app.use(compression());
app.use(morgan("combined", {stream: accessLogStream}))

app.use(cors())
app.use(bodyParser.json({ extended: false }))


app.use(mainRoutes)
app.use('/buy', buyRoutes)
app.use(premiumRoutes)
app.use(fogotpassRoutes)

// app.use((req, res, next)=>{
// 	res.sendFile('/login.html');
// })

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPassReq)
ForgotPassReq.belongsTo(User)

User.hasMany(DowUrl);
DowUrl.belongsTo(User)

sequelize
	.sync()
	.then((result) => {
		app.listen(process.env.PORT || 3006)
	})
	.catch((err) => console.log("DbErroRRR: ", err))


	