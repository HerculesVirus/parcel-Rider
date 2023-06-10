const express = require('express');
const eventController = require('../../../controller/admin/events.controller');
const router = express.Router();

router.route('/').post(eventController.create);
router.route('/:eventId').put(eventController.update);
router.route('/:eventId').get(eventController.get);
router.route('/:eventId').delete(eventController.delete);
router.route('/list').post(eventController.list)

module.exports = router;