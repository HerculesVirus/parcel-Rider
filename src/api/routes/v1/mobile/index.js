const express = require('express');
const authRoutes = require('./auth.route');
const userRoutes = require('./users.route');
const cardRoutes = require('./card.route');

const eventRoutes = require('./event.route');
const cmsRoutes =require('./cms.route')
const supportRoutes = require('./support.route')
const FaqRoutes = require('./faq.route')
const router = express.Router();
// const {uploadToCloudinary,cpUpload}=require('../../../utils/upload')
/**
 * GET v1/status
 */
router.use('/auth', authRoutes);
router.use('/event', eventRoutes);
router.use('/users', userRoutes);
router.use('/card', cardRoutes);
router.use('/cms',cmsRoutes)
router.use('/support' , supportRoutes)
router.use('/faq' , FaqRoutes)

module.exports = router;
