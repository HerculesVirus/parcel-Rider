const express = require('express');
const controller = require('../../../controller/mobile/event.controller');
const stripeController = require('../../../controller/mobile/stripe.controller');
const subscriptionController = require('../../../controller/mobile/subscription.controller');

const { cpUpload } = require('../../../utils/upload');
const router = express.Router();
const { userValidation } = require('../../../middleware/auth');

router.route('/create-event').post(userValidation, controller.createEvent);
router.route('/event-list').get(userValidation, controller.getEventList);
router.route('/event-request-list/:eventId').get(userValidation , controller.getEventRequestList)

router.route('/event-details').get(userValidation, controller.getEventDetails);

router
  .route('/:eventId/subscribe')
  .post(userValidation, subscriptionController.subscribeEvent);

router
  .route('/event-subscription-status')
  .post(userValidation, subscriptionController.playerSubscriptionStatusUpdate);

router
  .route('/subscribe-membership')
  .post(userValidation, subscriptionController.subscribeMembership);

router
  .route('/update-event/:eventId')
  .patch(userValidation, controller.updateUserEvent);

router
  .route('/stripe-payment-checkout')
  .post(userValidation, stripeController.createPaymentCheckout);

router
  .route('/membership-payment-checkout')
  .post(userValidation, stripeController.membershipPaymentCheckout);

router
  .route('/partner-creation')
  .post(userValidation, subscriptionController.becomeAPartner);

router
  .route('/update-status/partner')
  .post(userValidation, subscriptionController.adminApprovalForPartner);

router.route('/my-events').get(userValidation, controller.getMyEventList);

router
  .route('/my-reserve-events')
  .get(userValidation, controller.getMyReserveEvents);

router
  .route('/my-events-history')
  .get(userValidation, controller.getMyEventsHistory);

router.route('/my-event-cancel').post(userValidation, controller.eventCancelByPlayer)

router.route('/my-wallet-balance').get(userValidation, controller.getPlayerCurrentBalance)

module.exports = router;
