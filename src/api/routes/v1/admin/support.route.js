const express = require('express');
const supportController = require('../../../controller/admin/support.controller');
const router = express.Router();

router.route('/').post(supportController.create);
router.route('/:supportId').put(supportController.update);
router.route('/:supportId').get(supportController.get);
router.route('/:supportId').delete(supportController.delete);
router.route('/list').post(supportController.list)

module.exports = router;