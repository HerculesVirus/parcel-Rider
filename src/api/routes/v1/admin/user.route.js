const express = require('express');
const controller = require('../../../controller/admin/user.controller');
const router = express.Router();


// router.route('/create').post(cpUpload,controller.create)
// router.route('/edit/:userId').put( cpUpload,controller.edit)
router.route('/list').post(controller.list)
router.route('/delete/:userId').delete(controller.delete)
// router.route('/:userId').get(controller.get)



module.exports = router;