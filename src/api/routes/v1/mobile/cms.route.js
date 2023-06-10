const express = require('express');
const cmsController = require('../../../controller/mobile/cms.controller');
const router = express.Router();

const { userValidation } =require('../../../middleware/auth')

router.route('/party-lux').get(cmsController.getPartyLuxAboutUs)
router.route('/privacy-policay').get(cmsController.getPrivacyPolicyAboutus)
router.route('/terms-and-conditions').get(cmsController.getTermAndConditionsAboutus)


module.exports = router;