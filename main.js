const url = "http://localhost:3006";

//for expense.html
async function addExpense() {
	const amontInput = document.getElementById("amount")
	const descInput = document.getElementById("desc")
	const typeInput = document.getElementById("type")

	let isValid = true
	if (!amontInput.checkValidity()) {
		isValid = false;
	}
	if (!descInput.checkValidity()) {
		isValid = false;
	}
	if (!typeInput.checkValidity()) {
		isValid = false;
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

		showItem(itemAdded.data);
		setTimeout(show_LeaderBoard, 3000);
	}
}

function showItem(element) {
	document.getElementById(
		"main-container"
	).innerHTML += `<div id = "${element.id}">${element.amount}-${element.desc}-${element.type} <button type="submit" onclick="deleteItem(${element.id})">Delete Item</button></div>`
}

window.addEventListener("DOMContentLoaded", async (event) => {
	const token = localStorage.getItem("token")

	try {
		const allItems = await axios.get(`${url}/expenses`, {
			headers: { Authorization: token },
		})

		const items = allItems.data

		items.forEach((element) => {
			showItem(element)
		})
	} catch (err) {
		console.log(err)
	}

	const decodedToken = parseJwt(token)
	//console.log(decodedToken);

	if (decodedToken.is_premium) {
		document.getElementById(
			"premium-show"
		).innerHTML = `<div><h5>Hi! ${decodedToken.name} you are now a Premium User</h5></div>`
		show_LeaderBoard()
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
		await axios.delete(`${url}/expense/delete/${id}`);
		
		document.getElementById(id).remove();
		setTimeout(show_LeaderBoard, 3000);
		
		
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

			setTimeout(show_LeaderBoard, 3000);
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
