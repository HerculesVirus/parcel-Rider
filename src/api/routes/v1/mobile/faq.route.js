const express = require('express');
const faqController = require('../../../controller/mobile/faq.controller');
const router = express.Router();

const { userValidation } =require('../../../middleware/auth')
router.route('/list').get(faqController.getFaqList)

module.exports = router;