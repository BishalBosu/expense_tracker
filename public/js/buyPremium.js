//buy premium
async function buyPremium() {
	console.log("buypremium hited")
	const token = localStorage.getItem("token")

	const response = await axios.get(`${url}/buy/premium`, {
		headers: { Authorization: token },
	})
	console.log(response)
	var options = {
		key: response.data.key_id,
		order_id: response.data.order.id,
		//this handler function will handle sucess payment
		handler: async function (response) {
			const res = await axios.post(
				`${url}/buy/updatetransactionstatus`,
				{
					order_id: options.order_id,
					payment_id: response.razorpay_payment_id,
					name: parseJwt(token).name,
					email: parseJwt(token).userEmail,
				},
				{ headers: { Authorization: token } }
			)
			console.log("ress from handler", res)

			localStorage.setItem("token", res.data.token)

			alert("You are a Premium User Now")

			document.getElementById(
				"premium-show"
			).innerHTML = `<div><h5>Hi! ${localStorage.getItem(
				"name"
			)} you are now a Premium User</h5></div>`
			document.getElementById("report").innerHTML =
				'<div><br><hr>(PREMIUM feature)<h2>-----Report-----</h2></div><div class="row btn-group" role="group" aria-label="Basic mixed styles example"><button type="button" class="col-2 btn btn-primary" onclick="showDailyReport">Daily Report</button><button type="button" class="col-2 btn btn-primary" onclick="showWeeklyReport">Weekly Report</button><button type="button" class="col-2 btn btn-primary" onclick="showMonthlyReport">Monthly Report</button></div><div id="report-content"></div>'
			document.getElementById(
				"download-report"
			).innerHTML = `<div><br><hr>(PREMIUM feature)<h2></h2></div><button class="btn btn-primary" onclick="dowloadReport()">Download report</button>`
			setTimeout(show_LeaderBoard, 3000)
		},
	}

	const rzp1 = new Razorpay(options)
	rzp1.open()
	//e.preventDefault();

	rzp1.on("payment.failed", function (response) {
		alert("Transaction FAILED! REPAY YOU FEES")
		console.log(response)
	})
}