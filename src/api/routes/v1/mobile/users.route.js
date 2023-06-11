const express = require('express');
const controller = require('../../../controller/mobile/user.controller');
const cardController = require('../../../controller/mobile/card.controller');
const router = express.Router();

const { profileUpload,uploadSingle,cpUpload ,multi_upload } = require('../../../utils/upload')
const { userValidation } =require('../../../middleware/auth')

router.route('/me').get(userValidation, controller.getUser)
router.route('/register-userslist').post(userValidation, controller.getRegisterUserList);
router.route('/profile/:userId').get(userValidation ,controller.getProfile);
router.route('/create-profile').post(userValidation , controller.createProfile)
router.route('/profile').put( userValidation ,cpUpload,controller.updateProfile)
router.route('/update-profile').patch(userValidation , controller.updateUserProfile);
router.route('/upload-photo').post(userValidation , profileUpload , controller.uploadProfileImage)
router.route('/upload-multiple-photo').post(userValidation , controller.uploadMultiImage)

module.exports = router;