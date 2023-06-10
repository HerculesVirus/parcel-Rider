const Faq = require('../../model/faq.model');
const mongoose = require('mongoose')

exports.create = async(req, res) =>{
    try{
        let { question , answer}  = req.body;
        let faq = await Faq.findOne({question}).lean(true);
        if(!faq){
            faq =  await Faq.create({question , answer})
            return res.send({ success: true, message: 'Faq created successfully', faq })
        }
        else{
            return res.send({ success: true, message: 'Faq already exist successfully', faq })
        }
    }
    catch(error){
        res.status(500).json(error)
    }
}

exports.get = async (req,res) => {
    try{

    }
    catch(error){
        res.status(500).json(error)
    }
}
exports.list = async (req , res) => {
    try{

    }
    catch(error){
        res.status(500).json(error)
    }
}


exports.update = async (req , res) => {
    try{

    }
    catch(error){
        res.status(500).json(error)
    }
}

exports.delete = async (req , res) => {
    try{

    }
    catch(error){
        res.status(500).json(error)
    }
}