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
    alert(`Welcome to Expense app ${user.data.name}! You can now go to Log In page and Log In!`)
    }
    catch(err){console.log(err)}
}
}

async function logInUser() {
	// Get form input values
	const emailInput = document.getElementById("CustomEmail")
	const passwordInput = document.getElementById("CustomPassword")
    const checkInput = document.getElementById('invalidCheck')


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

			if (login_result.data.email == email) alert("Log in sucessfully!")
			else if (login_result.data.email == "not found")
				show("<div class='text-danger'>Email not found</div>")
			else show("<div class='text-danger'>Password does not matched</div>")
		} catch (err) {
			console.log(err)
		}
	}
}

function show(element) {
	document.getElementById("main-container").innerHTML += element
}
