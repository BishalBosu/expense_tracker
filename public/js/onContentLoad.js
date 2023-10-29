window.addEventListener("DOMContentLoaded", async (event) => {
	if(!localStorage.getItem("token")){
	 return window.location.href = "login.html"
	}
	
	document.getElementById("selectLen").addEventListener("input", setPageLen);

	
	

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