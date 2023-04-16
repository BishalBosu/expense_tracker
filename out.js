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
		
		try {
			const user = await axios.post(`${url}/user/signup`, obj)
			alert(
				`Welcome to Expense app ${user.data.name}! You can now go to Log In page and Log In!`
			)
			window.location.href = "login.html"
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
			console.log(login_result);
			localStorage.setItem('token', login_result.data.token)
			localStorage.setItem('name', login_result.data.name)
			localStorage.setItem('premium', login_result.data.is_premium)

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