const url = "http://localhost:3006";

function registerUser() {
    const name = document.getElementById("validationCustom").value;
    const email = document.getElementById("validationCustomEmail").value;
    const password = document.getElementById("exampleInputPassword1").value;

    obj = {
        name,
        email,
        password
    };
    console.log(obj);


	axios.post(`${url}/user/signup`, obj);
};
