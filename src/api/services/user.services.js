const models = require('../model/index');
let userServices = (module.exports = {
  createUser: async (payLoad) => {
    let savingObjects = models.user(payLoad);
    let result = await savingObjects.save();
    return result;
  },

  findSubscribedPlayer: async (playerId, event) => {
    try {
      return await models.subscription.findOne({
        userId: playerId,
        eventId: event,
      });
    } catch (error) {
      throw createError(500);
    }
  },

  updatePlayerSubscription: async (id, status) => {
    try {
      return await models.subscription.findOneAndUpdate(
        { _id: id },
        { isAcceptedByOwner: status },
        { new: true }
      );
    } catch (error) {
      throw createError(500);
    }
  },

});
