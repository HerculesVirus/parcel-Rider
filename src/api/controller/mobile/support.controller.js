const globalServices = require('../../services/index');

const models = require('../../model');

module.exports = {
    create: async (req, res)=> {
        try{
            let payload = req.body;
            let support = await models.support.create(payload)
            let setting = await models.settings.findOne({})
            let contactInfo = setting.contactInfo   ?  setting.contactInfo : {}
            if(support){
                return globalServices.global.returnResponse(
                    res,
                    200,
                    false,
                    'Support is created',
                    {support , contactInfo}
                  );
            }
            else{
                return globalServices.global.returnResponse(
                    res,
                    401,
                    true,
                    'Something wrong while create Support',
                    {}
                );
            }
        }
        catch(error){
            res.status(500).json(error);
        }

    }
}
