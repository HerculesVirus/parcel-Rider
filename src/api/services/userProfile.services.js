const models = require('../model/index');
let userProfileServices = (module.exports = {
  createUser: async (payLoad) => {
    let savingObjects = models.userProfile(payLoad);
    let result = await savingObjects.save();
    return result;
  },

  updateUserProfile : async (id , payload , projection )=>{
    try{
      return await models.userProfile.findOneAndUpdate(
        { _id: id },
        {
          $set: payload,
        },
        { new: true , projection: {...projection} }
      );
    }
    catch(error){
      throw createError(500);
    }
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