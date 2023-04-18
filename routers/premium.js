const express = require('express');
const authController = require('../controller/auth')
const premiumontroller = require('../controller/premium')

const router = express.Router();


router.get('/premium/getleaderboard', authController.authenticate, premiumontroller.getLeaderBoardData)



module.exports = router;
