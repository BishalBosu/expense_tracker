const url = "http://localhost:3006"

async function registerUser() {
	// Get form input values
	const nameInput = document.getElementById("validationCustom")
	const emailInput = document.getElementById("validationCustomEmail")
	const passwordInput = document.getElementById("exampleInputPassword1")
	const checkInput = document.getElementById("invalidCheck")

	let isValid = true
	if (!nameInput.checkValidity()) {
		isValid = false
	}
	if (!emailInput.checkValidity()) {
		isValid = false
	}
	if (!passwordInput.checkValidity()) {
		isValid = false
	}
	if (!checkInput.checkValidity()) {
		isValid = false
	}

	// If form input values are valid, submit form data to server
	if (isValid) {
		const name = nameInput.value
		const email = emailInput.value
		const password = passwordInput.value

		obj = {
			name,
			email,
			password,
		}
		console.log(obj)
		try {
			const user = await axios.post(`${url}/user/signup`, obj)
			alert(
				`Welcome to Expense app ${user.data.name}! You can now go to Log In page and Log In!`
			)
		} catch (err) {
			if (err.response.status == 409)
				show("<div class='text-danger'>Email already exist g to Login</div>")
		}
	}
}

//for login.html
async function logInUser() {
	// Get form input values
	const emailInput = document.getElementById("CustomEmail")
	const passwordInput = document.getElementById("CustomPassword")
	const checkInput = document.getElementById("invalidCheck")

	let isValid = true
	if (!emailInput.checkValidity()) {
		isValid = false
	}
	if (!passwordInput.checkValidity()) {
		isValid = false
	}
	if (!checkInput.checkValidity()) {
		isValid = false
	}

	// If form input values are valid, submit form data to server
	if (isValid) {
		const email = emailInput.value
		const password = passwordInput.value

		obj = {
			email,
			password,
		}
		try {
			const login_result = await axios.post(`${url}/user/login`, obj)

			alert("Log in sucessfully!")
			window.location.href = "expense.html"
		} catch (err) {
			if (err.response.status == 404)
				show("<div class='text-danger'>Email not found</div>")
			else show("<div class='text-danger'>Password does not matched</div>")
		}
	}
}

function show(element) {
	document.getElementById("main-container").innerHTML += element
}

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
		const amount = amontInput.value;
		const desc = descInput.value;
		const type = typeInput.value;

		obj = {
			amount,
			desc,
			type
		}

		const itemAdded = await axios.post(`${url}/expense/add-item`, obj)

		showItem(itemAdded.data);
	}
}


function showItem(element){
	document.getElementById('main-container').innerHTML += `<div id = "${element.id}">${element.amount}-${element.desc}-${element.type} <button type="submit" onclick="deleteItem(${element.id})">Delete Item</button></div>`
}

window.addEventListener("DOMContentLoaded", async (event) => {

	try{
		const allItems = await axios.get(`${url}/expenses`)		

		const items = allItems.data;

		items.forEach(element => {
			showItem(element)
		});



	}
	catch(err){
		console.log(err)
	}


  });

  async function deleteItem(id){
	
	try{
		await axios.delete(`${url}/expense/delete/${id}`)
		document.getElementById(id).remove();
	}
	catch(err){
		console.log(err)
	}

  }