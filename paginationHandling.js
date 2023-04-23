const getForPev = (prevPageNo, one_li, two_li, three_li) => {
	let prev = prevPageNo
	let next = prev + 4

	if (prevPageNo > 0) {
		prev = prevPageNo - 1
		one_li.firstChild.innerText = prev + 1
		two_li.firstChild.innerText = prev + 2
		three_li.firstChild.innerText = prev + 3
		next = prev + 4
	}

	return { prev, next }
}

const getFor = async (pageNo) => {
	const token = localStorage.getItem("token");
	try {
		const pageLength = 3;
		const allItems = await axios.get(`${url}/expensespage/?pageno=${pageNo}&pagelen=${pageLength}`, {
			headers: { Authorization: token },
		})

		const items = allItems.data
		document.getElementById(
			"expenses-contsiner"
		).innerHTML =`<h6>PAGENO: ${pageNo}</h6>`;
		items.forEach((element) => {
			showItem(element)
		})
	} catch (err) {
		console.log(err)
	}
}



const getForNext = async (nextPageNo, one_li, two_li, three_li) => {
	const token = localStorage.getItem("token");
	try {
		const response = await axios.get(`${url}/expenseslength`, {
			headers: { Authorization: token },
		})

		const length = response.data.length;
		//console.log(length)

		let next = nextPageNo
		let prev = next - 4

		if (next < Math.floor(length / 3) + 2) {
			
			next = nextPageNo + 1
			one_li.firstChild.innerText = next - 3
			two_li.firstChild.innerText = next - 2
			three_li.firstChild.innerText = next - 1
			prev = next - 4
		}

		return { prev, next };
	} catch (err) {
		console.log(err);
	}
}
