const User = require('../../model/users.model')
const Profile = require('../../model/userProfile.model')


// API to get users list
exports.list = async (req,res) => {

    try{
        let { all, page, limit } = req.query
        let { username, email , createdAtFrom, createdAtTo , role  } = req.body
        const filter = {}

        if(username){
            username = username.trim()
            filter.username = { $regex: username.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' };
        }

        if(email){
            filter.email = email.toLowerCase().trim()
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

        const total = await User.countDocuments(filter)

        console.log("total: ",total)

        if (page > Math.ceil(total / limit) && total > 0)
            page = Math.ceil(total / limit)

        let pipeline = [
            { $match : filter },
            { $sort: { createdAt: -1 } }
        ]

        pipeline.push({ $skip: limit * (page - 1) })
        pipeline.push({ $limit: limit })

        //profile

        pipeline.push(
            {
                $lookup:{
                    from: "userprofiles",
                    localField: "_id",
                    foreignField: "userId",
                    as: "profile"
                  }
            }
        )
        pipeline.push(
            {$unwind: {path: "$profile" , preserveNullAndEmptyArrays: true}}
        )
        pipeline.push(
            {
                $lookup: {
                  from: "events",
                  localField: "profile.joinedEvents",
                  foreignField: "_id",
                  pipeline:[
                    {$project: {name:1 }}
                  ],
                  as: "profile.joinedEvents"
                }
              }
        )
        // {
        //     $lookup: {
        //       from: 'users',
        //       localField: 'userId',
        //       foreignField: '_id',
        //       pipeline: [
        //         {
        //           $lookup:{
        //             from: "userprofiles",
        //             localField: "_id",
        //             foreignField: "userId",
        //             as: "profile"
        //           }
        //         },
        //         {$unwind: {path: "$profile" , preserveNullAndEmptyArrays: true}},
        //         {
        //           $project: {
        //             profile: { 
        //               profileImage:  "$profile.profileImage",
        //               description:"$profile.description",
        //               age: "$profile.age",
        //               gender: "$profile.gender",
        //               phoneNumber: "$profile.phoneNumber",
        //               location: "$profile.location",
        //               hobbies: "$profile.hobbies",
        //               interests : "$profile.interests",
        //               isPrivate : "$profile.isPrivate",
        //               phoneCode:"$profile.phoneCode",
        //             },
        //             username: 1,
        //             email: 1,
        //             _id: 1
        //           }
        //         }
        //       ],
        //       as: 'userDetail',
        //     },
        //   },
        //   {$unwind: {path: "$userDetail" , preserveNullAndEmptyArrays: true}},
    


        pipeline.push(
            {
                $project: {
                    _id: 1, username: 1, email: 1, createdAt: 1, profile:1,
                    // profileImage:1, companyName:  1,
                    // website: 1,
                    // designation: 1,
                    // walletAddress:1,
                    role:1,
                    // description: 1, emailVerified: 1, facebookLink: 1, twitterLink: 1, gPlusLink: 1, vineLink: 1, 
                    status:1,
                  //  profileImage: { $ifNull: [{ $concat: [uploadedImgPath, '$profileImageLocal'] }, ''] }
                }
            }
        )

        const users = await User.aggregate(pipeline)

        return res.send({
            success: true, message: 'Users fetched successfully',
            data: {
                users,
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

// API to delete user
exports.delete = async (req, res, next) => {
    try {
        const { userId } = req.params
        if (userId) {
            const user = await User.deleteOne({ _id: userId })
            if (user && user.deletedCount){
                const profile =await Profile.deleteOne({userId})
                if(profile && profile.deletedCount){
                    return res.send({ success: true, message: 'User and his profile deleted successfully', userId })
                }else{
                    return res.send({ success: true, message: 'User deleted successfully', userId })
                }
            }

            else return res.status(400).send({ success: false, message: 'User not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'User Id is required' })
    } catch (error) {
        return next(error)
    }
}