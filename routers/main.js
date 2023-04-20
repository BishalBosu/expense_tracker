const express = require('express');
const mainController = require('../controller/main');
const authController = require('../controller/auth')

const router = express.Router();

router.post("/user/signup", mainController.postRegUsers);

router.post("/user/login", mainController.postLogIn)

router.post("/expense/add-item", mainController.postAddItem)

router.get('/expenses', authController.authenticate , mainController.getAllItems)

router.delete("/expense/delete/:itemId", mainController.deleteItem)

router.post("/password/forgotpassword", mainController.postResetPass)

//router.get()

module.exports = router;