const express = require('express');
const cmsController = require('../../../controller/admin/cms.controller');
const router = express.Router();

router.route('/party-lux').post(cmsController.upsertPartyluxAboutUs);
router.route('/privacy-policay').post(cmsController.upsertPrivacyPolicyAboutus)
router.route('/terms-and-conditions').post(cmsController.upsertTermAndConditionsAboutus)

module.exports = router;