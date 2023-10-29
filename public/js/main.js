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
		"expenses-container"
	).innerHTML += `<div id = "${element.id}">${element.amount}-${element.desc}-${element.type} <button type="submit" class="btn btn-danger btn-sm" onclick="deleteItem(${element.id})">Delete Item</button></div><hr>`
}


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
	window.location.href = "login.html"
	localStorage.removeItem("token");
	localStorage.removeItem("name");

}

