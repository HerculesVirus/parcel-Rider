
const Settings = require('../../model/settings.model')


exports.updateSettings= async (req,res)=>{
    try{
        const payload = req.body
        console.log("payload: ",payload)
        const findSetting = await Settings.findOne({})
        console.log("findSetting: ",findSetting)
        let settings;
        if(findSetting){
            settings = await Settings.findOneAndUpdate({}, payload , { new: true})
        }else{
            settings = await Settings.create(payload)
        }
    
        return res.json({ success: true, message: 'Settings updated successfully',settings})
    }
    catch(error){
        res.status(500).json(error)
    }





}

exports.getSettings= async (req,res)=>{
    try{
        const findSetting = await Settings.findOne({})
        if(findSetting){
            return res.json({ success: true, message: 'Settings retrieved successfully',settings : findSetting })
        }
        else{
            return res.json({ success: true, message: 'Settings retrieved successfully',settings : {} })
        }
    }
    catch(error){
        res.status(500).json(error)
    }

}