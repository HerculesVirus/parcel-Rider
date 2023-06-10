const models = require('../model/index');

// *************************************************************************
let stripeServices = (module.exports = {
  // **********************************************************************

  updatePaymentStatus: async (id) => {
    try {
      if (id) {
        return await models.stripePayment.findOneAndUpdate(
          { _id: id },
          {
            paymentStatus: 'paid',
          },
          { new: true }
        );
      } else {
        console.log('payment not succeeded');
      }
    } catch (error) {
      throw createError(500);
    }
  },

  findPaymentsByObjects: (payLoad) =>
    new Promise((resolve, reject) =>
      models.stripePayment
        .findOne(payLoad)
        .then((data) => resolve(data))
        .catch((error) => {
          console.log('error => findPaymentsByObjects:', error);
          reject('');
        })
    ),

  // **********************************************************************
});
