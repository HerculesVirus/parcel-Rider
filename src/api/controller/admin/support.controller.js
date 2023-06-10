
const models = require('../../model')
const mongoose = require('mongoose')

exports.create = async(req, res) =>{
    try{
        let { firstName , email , message}  = req.body;
        let support = await  models.support.findOne({email , message: message.trim()}).lean(true);
        if(!support){
            support =  await models.support.create({firstName , email , message})
            return res.send({ success: true, message: 'Support created successfully', support })
        }
        else{
            return res.send({ success: true, message: 'Support already exist successfully', support })
        }
    }
    catch(error){
        res.status(500).json(error)
    }
}

exports.get = async (req,res) => {
    try{
        return res.send({ success: true, message: 'Support created successfully',  api: "In-progress" })

    }
    catch(error){
        res.status(500).json(error)
    }
}
exports.list = async (req , res) => {
    try{
        let { all, page, limit } = req.query
        console.log("events: List APi hit")
        let { username , name , createdAtFrom, createdAtTo , role  } = req.body
        const filter = {}


        if(username){
            username = username.trim()
            filter.user.username = { $regex: username.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' };
        }


        if(name){
            name = name.trim()
            filter.name = { $regex: name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' };
        }


        if(createdAtFrom && createdAtTo) {
            let startDate = moment.utc(new Date(createdAtFrom)).add(1, 'day').format('YYYY-MM-DD');
            let endDate   = moment.utc(new Date(createdAtTo)).add(2, 'day').format('YYYY-MM-DD');
            filter.createdAt = { $gte : new Date(startDate), $lte : new Date(endDate) } 
        }

        if(role)
        {
            filter.role=role
        }




        else if(createdAtFrom){
            let startDate = moment.utc(new Date(createdAtFrom)).add(1, 'day').format('YYYY-MM-DD');
            filter.createdAt = { $gte : new Date(startDate) } 
        }

        else if(createdAtTo){
            let endDate = moment.utc(new Date(createdAtTo)).add(2, 'day').format('YYYY-MM-DD');
            filter.createdAt = { $lte : new Date(endDate) } 
        }
    

        console.log('------------')
        console.log("Filter:", filter)
        console.log('------------')

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        // if (!all)
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        const total = await models.support.countDocuments({})
        console.log("total: ",total)

        console.log("total: ",total)

        if (page > Math.ceil(total / limit) && total > 0)
        page = Math.ceil(total / limit)

        let pipeline = [
            { $match : filter },
            { $sort: { createdAt: -1 } }
        ]

        pipeline.push({ $skip: limit * (page - 1) })
        pipeline.push({ $limit: limit })

        const supports = await models.support.aggregate(pipeline)

        return res.send({
            success: true, message: 'support fetched successfully',
            data: {
                supports,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        })




        // return res.send({ success: true, message: 'Support created successfully',  api: "In-progress" })
    }
    catch(error){
        res.status(500).json(error)
    }
}


exports.update = async (req , res) => {
    try{
        return res.send({ success: true, message: 'Support created successfully',  api: "In-progress" })
    }
    catch(error){
        res.status(500).json(error)
    }
}

exports.delete = async (req , res) => {
    try{
        return res.send({ success: true, message: 'Support created successfully',  api: "In-progress" })
    }
    catch(error){
        res.status(500).json(error)
    }
}