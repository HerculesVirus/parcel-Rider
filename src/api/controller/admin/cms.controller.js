const Settings = require('../../model/settings.model');

exports.upsertPartyluxAboutUs = async(req,res) => {
    try{
        const { partyLuxCms } = req.body
        let settings;
        let checkSettings= await Settings.findOne({})
        if(checkSettings){
            settings = await Settings.findOneAndUpdate({},{$set: {partyLux: partyLuxCms}},{new: true})
            return res.status(200).send({ success: true, message: 'party-lux cms updated successfully'  , data:{ partyLux :settings.partyLux } })
        }
        else{

            settings = await Settings.create( {partyLux: partyLuxCms})
            return res.status(200).send({ success: true, message: 'party-lux cms created successfully'  , data:{ partyLux :settings.partyLux } })
        }
        
    }
    catch(error){
        res.status(500).json(error);
    }
}

exports.upsertPrivacyPolicyAboutus = async (req,res) => {
    try{
        const { privacyPolicyCms } = req.body
        let settings;
        let checkSettings= await Settings.findOne({})
        if(checkSettings){
            settings = await Settings.findOneAndUpdate({},{$set: {privacyPolicy: privacyPolicyCms}},{new: true})
            return res.status(200).send({ success: true, message: 'party-lux cms updated successfully'  , data:{ privacyPolicy :settings.privacyPolicy } })
        }
        else{

            settings = await Settings.create( {privacyPolicy: privacyPolicyCms})
            return res.status(200).send({ success: true, message: 'party-lux cms created successfully'  , data:{ privacyPolicy :settings.privacyPolicy } })
        }
    }
    catch(error){
        res.status(500).json(error)
    }
}

exports.upsertTermAndConditionsAboutus = async (req,res) => {
    try{
        const { termsAndConditionCms } = req.body
        let settings;
        let checkSettings= await Settings.findOne({})
        if(checkSettings){
            settings = await Settings.findOneAndUpdate({},{$set: {termsAndCondition: termsAndConditionCms}},{new: true})
            return res.status(200).send({ success: true, message: 'party-lux cms updated successfully'  , data:{ termsAndCondition :settings.termsAndCondition } })
        }
        else{

            settings = await Settings.create( {termsAndCondition: termsAndConditionCms})
            return res.status(200).send({ success: true, message: 'party-lux cms created successfully'  , data:{ termsAndCondition :settings.termsAndCondition } })
        }
    }
    catch(error){
        res.status(500).json(error)
    }
}