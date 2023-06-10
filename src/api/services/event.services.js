const models = require('../model/index');
let eventServices = (module.exports = {
  createEventByUser: async (payLoad) => {
    let savingObjects = models.event(payLoad);
    let result = await savingObjects.save();
    return result;
  },

  createMembershipByUser: async (payLoad) => {
    let savingObjects = models.membership(payLoad);
    let result = await savingObjects.save();
    return result;
  },

  partnerCreation: async (payLoad) => {
    let savingObjects = models.partner(payLoad);
    let result = await savingObjects.save();
    return result;
  },

  updateEvent: async (id, payload) => {
    try {
      return await models.event.findOneAndUpdate(
        { _id: id },
        {
          $set: payload,
        },
        { new: true }
      );
    } catch (error) {
      throw createError(500);
    }
  },
});
