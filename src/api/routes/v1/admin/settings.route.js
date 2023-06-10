const express = require('express');
const controller = require('../../../controller/admin/settings.controller');
const router = express.Router();

router.route('/update').put(controller.updateSettings)
router.route('/get').get(controller.getSettings)

module.exports = router;