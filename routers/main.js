const express = require('express');
const mainController = require('../controller/main');

const router = express.Router();

router.post("/user/signup", mainController.postRegUsers);

router.post("/user/login", mainController.postLogIn)

router.post("/expense/add-item", mainController.postAddItem)

router.get('/expenses', mainController.getAllItems)

router.delete("/expense/delete/:itemId", mainController.deleteItem)

module.exports = router;