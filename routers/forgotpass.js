const express = require('express');
const forgotpassController = require('../controller/forgotpass');


const router = express.Router();

router.post("/password/forgotpassword", forgotpassController.postForgotPass);
router.use("/password/resetpassword/:uuid", forgotpassController.resetPassForm);
router.post("/password/updatepassword", forgotpassController.postUpdatePass)



//router.get()

module.exports = router;