const globalServices = require('../../services/index');
module.exports = {
  createVipCard: async (req, res) => {
    try {
      let payLoad = req.body;
      const { eventId } = req.body;

      if (!eventId) {
        return globalServices.global.returnResponse(
          res,
          401,
          true,
          'Event id is required!',
          {}
        );
      }

      let { user } = req;
      let userId = user._id.toString();

      Object.assign(payLoad, { userId: userId });
      let result = await globalServices.card.createVipCard(payLoad);

      if (result) {
        return globalServices.global.returnResponse(
          res,
          200,
          false,
          'Event created successfully',
          result
        );
      } else {
        globalServices.global.returnResponse(
          res,
          400,
          true,
          'Something went wrong while creating Card!',
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
