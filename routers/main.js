const express = require('express');
const mainController = require('../controller/main');

const router = express.Router();

router.post("/user/signup", mainController.postRegUsers);



module.exports = router;