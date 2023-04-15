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
		const amount = amontInput.value;
		const desc = descInput.value;
		const type = typeInput.value;

		const token = localStorage.getItem('token');

		obj = {
			amount,
			desc,
			type,
			token
		}

		const itemAdded = await axios.post(`${url}/expense/add-item`, obj)

		showItem(itemAdded.data);
	}
}


function showItem(element){
	document.getElementById('main-container').innerHTML += `<div id = "${element.id}">${element.amount}-${element.desc}-${element.type} <button type="submit" onclick="deleteItem(${element.id})">Delete Item</button></div>`
}

window.addEventListener("DOMContentLoaded", async (event) => {

	const token = localStorage.getItem("token")
	try{
		const allItems = await axios.get(`${url}/expenses`, {headers: {"Authorization": token}})		

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