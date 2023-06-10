const express = require('express');
const controller = require('../../../controller/admin/membership.controller');
const router = express.Router();

router.route('/').post(controller.create) //Create
router.route('/get/:memberId').get(controller.get) //Retrieved
router.route('/update').put(controller.update) //Update
router.route('/:id').delete(controller.delete) //Delete

router.route('/list').post(controller.list); //


module.exports = router;