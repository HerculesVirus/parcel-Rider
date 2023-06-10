const express = require('express')
const userRoutes = require('./user.route')


const membershipRoutes = require('./membership.route')
// const adminRoutes = require('./admin.route')
// const roleRoutes = require('./roles.route')
// const emailRoutes = require('./email.route')
const settingsRoutes = require('./settings.route.js')
const cmsRoutes = require('./cms.route')
const faqRoutes = require('./faq.route')
const eventRoutes = require('./event.route')
const supportRoutes = require('./support.route')
// const contactRoutes = require('./contact.route')
// const cmsRoutes = require('./cms.routes')
// const activityRoutes = require('./activity.route')
// const gameRoutes = require('./games.route')
// const themeRoutes = require('./theme.route')
// const tournamentRoutes = require('./tournament.route')
// const sdkRoutes =require('./sdk.route')
// const newsRoutes =require('./news.route')
// const learningRoutes =require('./learningCenter.route')
// const rewardRoutes =require('./rewards.route')
// const promosRoutes =require('./promos.route')
// const reportedUser = require('./reportedUser.route')
// const seasonsRoutes = require('./seasons.route')
// const genreRoutes = require('./genre.route')
const authRoutes = require('./auth.route')
// const userRoutes = reuire('./user.route')


const router = express.Router()

/**
 * GET v1/admin
 */
// router.use('/staff', adminRoutes)
router.use('/auth',authRoutes)
// router.use('/role', roleRoutes)
router.use('/user', userRoutes)
// router.use('/email', emailRoutes)
router.use('/settings', settingsRoutes)
router.use('/cms',cmsRoutes)
router.use('/memberships',membershipRoutes)
// router.use('/seasons', seasonsRoutes)
router.use('/faq', faqRoutes)
router.use('/event',eventRoutes)
router.use('/support',  supportRoutes)
// router.use('/contacts', contactRoutes)
// router.use('/content', cmsRoutes)
// router.use('/activity', activityRoutes)
// router.use('/games', gameRoutes)
// router.use('/genres', genreRoutes)
// router.use('/theme', themeRoutes)
// router.use('/tournament',tournamentRoutes)
// router.use('/sdk',sdkRoutes)
// router.use('/news',newsRoutes)
// router.use('/learning',learningRoutes)
// router.use('/reward',rewardRoutes)
// router.use('/promos',promosRoutes)
// router.use('/reportedUser' , reportedUser)




module.exports = router