const express = require('express');
const controller = require('../../../controller/mobile/auth.controller');
// const { cpUpload } = require('../../../utils/upload')
const router = express.Router();

const { userValidation } =require('../../../middleware/auth')

router.route('/').get(controller.get)

router.route('/signin').post(controller.sigin);
router.route('/signup').post(controller.register);

router.route('/forget-password').post(controller.forgotPassword);
router.route('/reset-password').post(controller.resetPassword)

router.route('/verify-otp').post(controller.verifyOtp);
router.route('/resend-otp').post(controller.resendOtp);
//signin and register with the google;
router.route('/google').post(controller.google);
//signin and register with Apple;



module.exports = router;