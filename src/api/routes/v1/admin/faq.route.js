const express = require('express');
const faqController = require('../../../controller/admin/faq.controller');
const router = express.Router();

const { userValidation } =require('../../../middleware/auth')

router.route('/').post(faqController.create) //Create
router.route('/get/:faqId').get(faqController.get) //Retrieved
router.route('/update').put(faqController.update) //Update
router.route('/:id').delete(faqController.delete) //Delete

router.route('/list').post(faqController.list); //

module.exports = router;