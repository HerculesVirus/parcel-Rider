const globalServices = require('../../services/index');

const models = require('../../model');

module.exports = {
    getPartyLuxAboutUs: async (req, res)=> {
        let settings = await models.settings.findOne({}).lean(true)

        if(!settings){
            return globalServices.global.returnResponse(
                res,
                401,
                true,
                'party-lux cms is not created yet!',
                {}
              );
        }
        return globalServices.global.returnResponse(
            res,
            200,
            false,
            'party-lux cms is fetched successfully!',
            {partyLux: settings.partyLux ? settings.partyLux: ''}
          );
    },
    getPrivacyPolicyAboutus: async (req,res)=> {
        let settings = await models.settings.findOne({}).lean(true)

        if(!settings){
            return globalServices.global.returnResponse(
                res,
                401,
                true,
                'privacy-policy cms is not created yet!',
                {}
              );
        }
        return globalServices.global.returnResponse(
            res,
            200,
            false,
            'privacy-policy cms is fetched successfully!',
            {privacyPolicy: settings.privacyPolicy ? settings.privacyPolicy : ''}
          );
    },
    getTermAndConditionsAboutus: async (req,res)=> {
        let settings = await models.settings.findOne({}).lean(true)

        if(!settings){
            return globalServices.global.returnResponse(
                res,
                401,
                true,
                'Terms&Conditions cms is not created yet!',
                {}
              );
        }
        return globalServices.global.returnResponse(
            res,
            200,
            false,
            'Terms&Conditions cms is fetched successfully!',
            {termsAndCondition: settings.termsAndCondition ? settings.termsAndCondition : ''}
          );
    }



}
