const url = "http://localhost:3006"

//for expense.html
async function addExpense() {
	const amontInput = document.getElementById("amount")
	const descInput = document.getElementById("desc")
	const typeInput = document.getElementById("type")

	let isValid = true
	if (!amontInput.checkValidity()) {
		isValid = false
	}
	if (!descInput.checkValidity()) {
		isValid = false
	}
	if (!typeInput.checkValidity()) {
		isValid = false
	}

	// If form input values are valid, submit form data to server
	if (isValid) {
		const amount = amontInput.value
		const desc = descInput.value
		const type = typeInput.value

		const token = localStorage.getItem("token")

		obj = {
			amount,
			desc,
			type,
			token,
		}

		const itemAdded = await axios.post(`${url}/expense/add-item`, obj)

		showItem(itemAdded.data)
		setTimeout(show_LeaderBoard, 3000)
	}
}

function showItem(element) {
	document.getElementById(
		"expenses-contsiner"
	).innerHTML += `<div id = "${element.id}">${element.amount}-${element.desc}-${element.type} <button type="submit" class="btn btn-danger btn-sm" onclick="deleteItem(${element.id})">Delete Item</button></div><hr>`
}

window.addEventListener("DOMContentLoaded", async (event) => {
	if(!localStorage.getItem("token")){
	window.location.href = "login.html"
	}
	
	let prev = 0;
	let next = 4;

	getFor(1);

	const prev_li = document.getElementById("prev-li");
	prev_li.addEventListener("click", async (event1) =>{
		
		let prev_next = getForPev(prev, one_li, two_li, three_li);
		
		prev = prev_next.prev
		next = prev_next.next
		
	})

	const one_li = document.getElementById("one-li");
	one_li.addEventListener("click", async (event1) =>{
		const integer_oneli_value = one_li.innerText * 1;
		getFor(integer_oneli_value);
	})

	const two_li = document.getElementById("two-li");
	two_li.addEventListener("click", async (event1) =>{
		const integer_twoli_value = two_li.innerText * 1;
		getFor(integer_twoli_value);
	})

	const three_li = document.getElementById("three-li");
	three_li.addEventListener("click", async (event1) =>{
		const integer_threeli_value = three_li.innerText * 1;
		getFor(integer_threeli_value);
	})
	const next_li = document.getElementById("next-li");
	next_li.addEventListener("click", async (event1) =>{		
		let prev_next = await getForNext(next, one_li, two_li, three_li);		
		prev = prev_next.prev;
		next = prev_next.next;		
	})



	
	const token = localStorage.getItem("token");
	const decodedToken = parseJwt(token)
	//console.log(decodedToken);

	if (decodedToken.is_premium) {
		document.getElementById(
			"premium-show"
		).innerHTML = `<div><h5>Hi! ${decodedToken.name} you are now a Premium User</h5></div>`
		show_LeaderBoard()
		document.getElementById("report").innerHTML =
			'<div><br><hr>(PREMIUM feature)<h2>-----Report-----</h2></div><div class="row btn-group" role="group" aria-label="Basic mixed styles example"><button type="button" class="col-2 btn btn-primary" onclick="showDailyReport">Daily Report</button><button type="button" class="col-2 btn btn-primary" onclick="showWeeklyReport">Weekly Report</button><button type="button" class="col-2 btn btn-primary" onclick="showMonthlyReport">Monthly Report</button></div><div id="report-content"></div>'
		document.getElementById(
			"download-report"
		).innerHTML = `<div><br><hr>(PREMIUM feature)<h2></h2></div><button class="btn btn-primary" onclick="dowloadReport()">Download report</button>`
	} else
		document.getElementById(
			"premium-show"
		).innerHTML = `<button class="btn btn-dark" type="button" onclick="buyPremium()">Buy Premium!</button>`
})
//front end jwt parser
function parseJwt(token) {
	var base64Url = token.split(".")[1]
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join("")
	)

	return JSON.parse(jsonPayload)
}

async function deleteItem(id) {
	try {
		await axios.delete(`${url}/expense/delete/${id}`)

		document.getElementById(id).remove()
		setTimeout(show_LeaderBoard, 3000)
	} catch (err) {
		console.log(err)
	}
}

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

//PREMIUM ONLY show leader board
async function show_LeaderBoard() {
	const token = localStorage.getItem("token")
	const decodedToken = parseJwt(token)

	if (decodedToken.is_premium) {
		document.getElementById("leader-board").innerHTML =
			"<div><br><hr>(PREMIUM feature)<h2>-----Leader Board-----</h2></div>"

		try {
			const user_data = await axios.get(`${url}/premium/getleaderboard`, {
				headers: { Authorization: token },
			})
			//console.log("leadBoardUserData: ", user_data.data);
			let i = 1
			user_data.data.forEach((element) => {
				document.getElementById(
					"leader-board"
				).innerHTML += `<div>#${i}: ${element.name} has Total Spent of: ${element.totalAmount}</div>`
				i += 1
			})
		} catch (err) {
			console.log("Show leader board error: ", err)
		}
	}
}

//PREMIUM only download and show report:

async function dowloadReport() {
	try {
		const token = localStorage.getItem("token")

		const response = await axios.get(`${url}/premium/downloadreport`, {
			headers: { Authorization: token },
		})

		const a = document.createElement("a")
		a.href = response.data.fileUrl
		a.download = "myexpense.csv"
		a.click()
	} catch (err) {
		console.log(err, "error in download report.")
	}
}

async function showDailyreport() {
	document.getElementById("report").innerHTML += ""
}

async function showWeeklyreport() {
	document.getElementById("report").innerHTML += ""
}
async function showMonthlyreport() {
	document.getElementById("report").innerHTML += ""
}


function logOut(){
	window.location.href = "expense.html"
	localStorage.removeItem("token");
	localStorage.removeItem("name");

}

