const express = require('express');
const forgotpassController = require('../controller/forgotpass');


const router = express.Router();

router.post("/password/forgotpassword", forgotpassController.postResetPass)

//router.get()

module.exports = router;