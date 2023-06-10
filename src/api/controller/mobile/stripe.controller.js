const globalServices = require('../../services/index');
const stripe = require('../../utils/stripe');
const modals = require('../../model');

// **************** Stripe checkout ********************************
module.exports = {
  createPaymentCheckout: async (req, res) => {
    // try {
    const { user } = req;
    const userRole = user.role;
    const userId = user._id;
    let { eventName, eventPrice, eventId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: eventName,
            },
            unit_amount: eventPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',

      success_url: 'http://localhost:3000/checkout-success',
      cancel_url: 'http://localhost:3000/checkout-cancel',
      customer_email: user.email,
    });

    if (session && session.id && session.url !== '') {
      let checkout = await modals.stripePayment.findOne({
        user: userId,
        eventId: eventId,
      });

      if (checkout && checkout._id) {
        globalServices.global.returnResponse(
          res,
          400,
          true,
          'You have already paid for this event!',
          {}
        );
        return;
      }

      if (checkout && checkout.paymentStatus === 'unpaid') {
        const updatePayLoad = {
          paymentUrl: session.url,
        };
        const updatedResult = await modals.stripePayment.findOneAndUpdate(
          checkout._id,
          { $set: updatePayLoad },
          { new: true }
        );
        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Payment checkout successfull!',
          updatedResult
        );

        return;
      }

      if (!checkout) {
        let result = await modals.stripePayment.create({
          eventSubscriber: user._id,
          customerId: session.id,
          paymentIntent: session.payment_intent,
          eventPrice: eventPrice,
          eventId: eventId,
          eventName: eventName,
          currency: session.currency,
          mode: session.mode,
          paymentStatus: session.payment_status,
          paymentMethodTypes: session.payment_method_types,
          paymentUrl: session.url,
        });

        if (result && result._id) {
          globalServices.global.returnResponse(
            res,
            200,
            false,
            'Payment checkout successfull!',
            result
          );
        } else {
          globalServices.global.returnResponse(
            res,
            400,
            true,
            'Payment checkout not saved!',
            {}
          );
        }
      }
    } else {
      globalServices.global.returnResponse(
        res,
        401,
        true,
        'Stripe checkout session not created!',
        {}
      );
    }
    // } catch (err) {
    //   res.status(500).json(err);
    // }
  },

  membershipPaymentCheckout: async (req, res) => {
    try {
    const { user } = req;
    const userId = user._id;
    let { membershipType, membershipFee } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: membershipType,
            },
            unit_amount: membershipFee * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',

      success_url: 'http://localhost:3000/checkout-success',
      cancel_url: 'http://localhost:3000/checkout-cancel',
      customer_email: user.email,
    });

    if (session && session.id && session.url !== '') {
      let checkout = await modals.membershipPayments.findOne({
        userId: userId,
      });

      if (checkout && checkout._id && checkout.isExpired===false) {
        globalServices.global.returnResponse(
          res,
          400,
          true,
          'You have already paid for this membership!',
          {}
        );
        return;
      }

      if (checkout && checkout.paymentStatus === 'unpaid') {
        const updatePayLoad = {
          paymentUrl: session.url,
        };
        const updatedResult = await modals.membershipPayments.findOneAndUpdate(
          checkout._id,
          { $set: updatePayLoad },
          { new: true }
        );
        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Payment checkout successfull for membership!',
          updatedResult
        );

        return;
      }

      if (!checkout) {
        let result = await modals.membershipPayments.create({
          userId: userId,
          customerId: session.id,
          paymentIntent: session.payment_intent,
          membershipType: membershipType,
          membershipFee: membershipFee,
          currency: session.currency,
          mode: session.mode,
          paymentStatus: session.payment_status,
          paymentMethodTypes: session.payment_method_types,
          paymentUrl: session.url,
        });

        if (result && result._id) {
          globalServices.global.returnResponse(
            res,
            200,
            false,
            'Payment checkout successfull for membership!!',
            result
          );
        } else {
          globalServices.global.returnResponse(
            res,
            400,
            true,
            'Payment checkout not saved!',
            {}
          );
        }
      }
    } else {
      globalServices.global.returnResponse(
        res,
        401,
        true,
        'Stripe checkout session not created!',
        {}
      );
    }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
