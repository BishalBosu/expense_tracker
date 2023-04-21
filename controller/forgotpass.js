const User = require("../model/registerdUsers")
const apiInstance = require("../util/smtp_sib")
const ForgotPassReq = require("../model/forgot_pass_req")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")

//reset password
exports.postForgotPass = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.body.email)
		const sender = {
			email: "bishalbosu@gmail.com",
		}
		//generating new uuid
		const uuid = uuidv4()

		await ForgotPassReq.create({
			id: uuid,
			userEmail: user.email,
			isactive: true,
		})

		const recever = [{ email: user.email }]

		await apiInstance.sendTransacEmail({
			sender,
			to: recever,
			subject: "Reset Your Password",
			textContent: "Reset your link from here.",
			htmlContent: `http://localhost:3006/password/resetpassword/${uuid}`,
		})
		res.json({ sucess: true, message: "email sent successfully!" })
	} catch (err) {
		res.status(404).json({
			sucess: false,
			message: "Email Not Found or something went wrong in internal server.",
		})
	}
}

exports.resetPassForm = async (req, res, next) => {
	const uuid = req.params.uuid

	try{
		const ForgotRequest = await ForgotPassReq.findByPk(uuid)

	if (ForgotRequest.isactive) {

		await ForgotRequest.update({isactive: false});

		return res.status(200).send(`<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
					rel="stylesheet" />
				<link
					href="https://getbootstrap.com/docs/5.3/assets/css/docs.css"
					rel="stylesheet" />
				<title>Forget password</title>
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
				<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
				<script>
		
					async function sendResetPassReq(uuid){
						console.log("req fired", uuid)
					   const newpass = document.getElementById("newpass").value;
					   const confirmpass = document.getElementById("confirmpass").value;
					   
					   if(newpass == confirmpass){
							try
							{ 
								await axios.post("http://localhost:3006/password/updatepassword", {password: newpass, uuid: uuid})
								alert("Password updated sucessfully");
								window.close() ;
							}catch(err){
								alert("Some Error or password cant be changed with this link any more.")
							}
					   }
					   else{
						alert("passwords should match!")
					   }
		
		
						
					}
				</script>
				
				
			</head>
			<body class="p-3 m-0 border-0 bd-example">
				<div class="row">
					<div class="col-sm-4">             
					   
						<label>New Password</label>
						<div class="form-group pass_show"> 
							<input id="newpass" type="password" class="form-control" placeholder="New Password"> 
						</div> 
						   <label>Confirm Password</label>
						<div class="form-group pass_show"> 
							<input id="confirmpass"type="password" class="form-control" placeholder="Confirm Password"> 
						</div> 
						<br>
						
						<button type="button" class="btn btn-success" onclick="sendResetPassReq('${uuid}')">Update Password</button>
					</div>  
				</div>
		
		
			</body>
			</html>`)

	
		

	}else{
		res.status(402).json({ message: "Link in Diabled!" })
	}

	}catch(err){
		res.status(404).json({ message: "Invalid link!" })
	}
}

exports.postUpdatePass = async (req, res, next) => {
	const password = req.body.password;
	const uuid = req.body.uuid;

	try {
		bcrypt.hash(password, 10, async (err, hash) => {
			if (err) console.log(err)
			
			const request = await ForgotPassReq.findByPk(uuid)

			await request.update({isactive: false})

			const user = await User.findByPk(request.userEmail)
			
			await user.update({password: hash})
			res.json({success: true, message: "Password updated sucessfully!"});

		})
	} catch (err) {
		await t.rollback()
		//indicating conflict by 409
		res.status(409).json(err)
	}
}
