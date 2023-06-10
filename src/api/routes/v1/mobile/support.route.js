const express = require('express');
const faqController = require('../../../controller/mobile/support.controller');
const router = express.Router();

const { userValidation } =require('../../../middleware/auth')
router.route('/create').post( faqController.create)

module.exports = router;