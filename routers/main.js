const express = require('express');
const mainController = require('../controller/main');

const router = express.Router();

router.post("/user/signup", mainController.postRegUsers);

router.post("/user/login", mainController.postLogIn)

module.exports = router;