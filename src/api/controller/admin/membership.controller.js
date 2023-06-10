const MemberShip = require('../../model/membership.model');
const mongoose = require('mongoose')


exports.create = async (req , res) => {
    try{

    }
    catch(error){
        res.status(500).json(error)
    }
}
exports.list = async (req, res) => {
    try{

        let { page, limit } = req.query
        let { username,amount ,  membershipType , createdAtFrom, createdAtTo , role  } = req.body
        const filter = {}


        if(username){
            username = username.trim()
            filter.username = { $regex: username.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' };
        }

        if(amount){
            amount = parseFloat(amount)
            filter.amount = amount
        }

        console.log('------------')
        console.log("Filter:", filter)
        console.log('------------')

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        // if (!all)
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10


        const total = await MemberShip.countDocuments(filter)

        console.log("total: ",total)

        if (page > Math.ceil(total / limit) && total > 0)
            page = Math.ceil(total / limit)

        let pipeline = [
            { $match : filter },
            { $sort: { createdAt: -1 } }
        ]

        pipeline.push({ $skip: limit * (page - 1) })
        pipeline.push({ $limit: limit })

        pipeline.push(
            {
                $lookup:{
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                  }
            }
        )
        pipeline.push(
            {$unwind: {path: "$user" , preserveNullAndEmptyArrays: true}}
        )

        const memberShip = await MemberShip.aggregate(pipeline)

        return res.send({
            success: true, message: 'MemberShip fetched successfully',
            data: {
                memberShip,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        })



    }
    catch(error){
        res.status(500).json(error);
    }
}

exports.get = async (req , res) => {
    try{
        const { memberId } = req.params
        console.log("here we are: ",memberId)
        if (memberId) {
            const member = await MemberShip.findOne({ _id : mongoose.Types.ObjectId(memberId) })
            if (member)
                return res.json({ success: true, message: 'Membership retrieved successfully', member })
            else return res.status(400).send({ success: false, message: 'Membership not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'member Id is required' })
    } 
    catch(error){
        res.status(500).json(error);
    }
}

exports.update = async (req, res) => {
    try{

    }
    catch(error){
        res.status(500).json(error);
    }
}

exports.delete = async (req, res) => {
    try{
        const payload = req.body
    }
    catch(error){
        res.status(500).json(error);
    }
}