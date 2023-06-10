const express = require('express');
const controller = require('../../../controller/admin/auth.controller');
const router = express.Router();

router.route('/signin').post(controller.sigin);

module.exports = router;


