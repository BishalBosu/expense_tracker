const url = "http://localhost:3006"

async function forgotPassword(){
    const email = document.getElementById("email").value;

    obj = {
        email
    }

    const response = await axios.post(`${url}/password/forgotpassword`, obj);

    alert("check your inbox We have sent a one time link to reset!")


}