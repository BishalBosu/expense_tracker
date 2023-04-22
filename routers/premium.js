const express = require('express');
const authController = require('../controller/auth')
const premiumontroller = require('../controller/premium')

const router = express.Router();


router.get('/premium/getleaderboard', authController.authenticate, premiumontroller.getLeaderBoardData)

router.get('/premium/downloadreport', authController.authenticate, premiumontroller.downloadreport)

module.exports = router;
