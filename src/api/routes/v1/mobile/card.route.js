const express = require('express');
const cardController = require('../../../controller/mobile/card.controller');
const router = express.Router();

const { userValidation } =require('../../../middleware/auth')
router.route('/create-cards').post( userValidation ,cardController.createVipCard)

module.exports = router;