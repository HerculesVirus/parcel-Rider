const globalServices = require('../../services/index');
const moment = require('moment');

const models = require('../../model');
const mongoose = require('mongoose');
module.exports = {
  createEvent: async (req, res) => {
    try {
      let payLoad = req.body;

      let { user } = req;
      let userId = user._id.toString();

      if (user.isVerified === true) {
        Object.assign(payLoad, { userId: userId });
        let result = await globalServices.event.createEventByUser(payLoad);
        console.log('result', result);
        if (result) {
          return globalServices.global.returnResponse(
            res,
            200,
            false,
            'Event created successfully',
            result
          );
        }
      } else if (user.isVerified === false) {
        globalServices.global.returnResponse(
          res,
          401,
          true,
          'Youu are not verified Yet! Please verify your OTP',
          {}
        );
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'user not found!',
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getEventList: async (req, res) => {
    try {
      let { user } = req;
      let userId = user._id.toString();
      let { limit, page } = req.query;
      let { distance } = req.query;
      const validEventsType = ['club', 'houseParty', 'bars'];

      let { price_range, maxParticipants, eventCategory, longitude, latitude } =
        req.query;

      limit = limit ? limit : 5;
      page = page ? page : 1;
      const queryLimit = parseInt(limit);

      /// map filter ///////////

      if (distance && !longitude && !latitude) {
        res.status(400).send({
          error: true,
          status: 400,
          msg: 'Missing Longitude and Latitude',
        });
        return;
      }

      const mapFilter = distance * 1000 || '';
      let coordinates = [longitude, latitude];

      const mapTrainings = mapFilter
        ? {
            location: {
              $geoWithin: {
                $centerSphere: [coordinates, mapFilter / 6371],
              },
            },
          }
        : {};

      ///// price_range filter /////////
      let priceObj = price_range || '';
      if (priceObj) {
        priceObj = JSON.parse(price_range);
      }

      const priceFilter =
        priceObj && priceObj !== ''
          ? {
              $or: [
                {
                  'admissionFee.male.amount': {
                    $gte: priceObj.min,
                    $lte: priceObj.max,
                  },
                },
                {
                  'admissionFee.female.amount': {
                    $gte: priceObj.min,
                    $lte: priceObj.max,
                  },
                },
                {
                  'admissionFee.couple.amount': {
                    $gte: priceObj.min,
                    $lte: priceObj.max,
                  },
                },
              ],
            }
          : {};

      ///// eventCategory filter /////////
      const eventFilter =
        eventCategory &&
        eventCategory !== '' &&
        validEventsType.includes(req.query.eventCategory)
          ? {
              eventCategory: req.query.eventCategory,
            }
          : {};

      let result = await models.event.aggregate([
        { $match: { ...eventFilter, ...priceFilter, ...mapTrainings } },
        { $skip: limit * page - queryLimit },
        { $limit: queryLimit },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: 'vipcards',
            localField: '_id',
            foreignField: 'eventId',
            pipeline: [{ $project: { cards: 1, userId, _id: 0 } }],
            as: 'vips',
          },
        },
        { $unwind: { path: '$vips', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'userprofiles',
                  localField: '_id',
                  foreignField: 'userId',
                  as: 'profile',
                },
              },
              {
                $unwind: { path: '$profile', preserveNullAndEmptyArrays: true },
              },
              {
                $project: {
                  profile: {
                    profileImage: '$profile.profileImage',
                    description: '$profile.description',
                    age: '$profile.age',
                    gender: '$profile.gender',
                    phoneNumber: '$profile.phoneNumber',
                    location: '$profile.location',
                    hobbies: '$profile.hobbies',
                    interests: '$profile.interests',
                    isPrivate: '$profile.isPrivate',
                    phoneCode: '$profile.phoneCode',
                    joinedEvents: '$profile.joinedEvents',
                  },
                  username: 1,
                  email: 1,
                  _id: 1,
                },
              },
            ],
            as: 'userDetail',
          },
        },
        { $unwind: { path: '$userDetail', preserveNullAndEmptyArrays: true } },
      ]);
      console.log('result: ', result);
      // let result = await models.event
      //   .find({
      //     // userId: userId,
      //     ...eventFilter,
      //     ...priceFilter,
      //     ...mapTrainings,
      //   })
      //   .sort({ createdAt: -1 })
      //   .skip(limit * page - queryLimit)
      //   .limit(queryLimit);

      if (result) {
        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Event list!',
          result
        );
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'Event not found!',
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getEventRequestList: async (req, res) => {
    try{
      let { user } = req;
      let userId = user._id.toString();
      const { eventId } = req.params
      let { limit, page } = req.query;


      limit = limit ? limit : 5;
      page = page ? page : 1;
      const queryLimit = parseInt(limit);

      let result= await models.subscription.aggregate([
        { $match: { eventId: mongoose.Types.ObjectId(eventId) , isAcceptedByOwner : "pending" } },
        { $skip: limit * page - queryLimit },
        { $limit: queryLimit },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'userprofiles',
                  localField: '_id',
                  foreignField: 'userId',
                  as: 'profile',
                },
              },
              {
                $unwind: { path: '$profile', preserveNullAndEmptyArrays: true },
              },
              {
                $project: {
                  profile: {
                    profileImage: '$profile.profileImage',
                    // description: '$profile.description',
                    age: '$profile.age',
                    gender: '$profile.gender',
                    // phoneNumber: '$profile.phoneNumber',
                    // location: '$profile.location',
                    // hobbies: '$profile.hobbies',
                    // interests: '$profile.interests',
                    // isPrivate: '$profile.isPrivate',
                    // phoneCode: '$profile.phoneCode',
                    // joinedEvents: '$profile.joinedEvents',
                  },
                  username: 1,
                  email: 1,
                  _id: 1,
                },
              },
            ],
            as: 'userDetail',
          },
        },
        { $unwind: { path: '$userDetail', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'vipcards',
            localField: 'eventId',
            foreignField: 'eventId',
            pipeline: [
              // {
              //   $match: {
              //     cards: {
              //       $elemMatch: {
              //         $expr: {
              //           $eq: ["$$vipCardId", "$_id"] // Replace '$$modelColumn' with your aggregate model column name and 'fieldName' with the field name within the cards array
              //         }
              //         // _id: "$subscription.vipCardId"
              //       }
              //     }
              //   }
              // },
              // { $match:{ cards: {$elemMatch:{_id : vipCardId} }}},
              { $project: {
                cards: 1,
                // {
                //   $filter: {
                //     input: '$cards',
                //     as: 'card',
                //     cond: {
                //       $eq: ['$$card._id', "vipCardId"]
                //     }
                //   }
                // },
                 _id: 0 } }],
            as: 'vips',
          }
        },
        { $unwind: { path: '$vips', preserveNullAndEmptyArrays: true } },
        

      ])

      // let result = await models.subscription
      // .find({
      //   eventId: mongoose.Types.ObjectId(eventId),
      //   isAcceptedByOwner : "pending"
      // })
      // .populate('vipCardId')
      // .populate({ path: 'userProfile', select: 'profileImage fullName age' })
      // .sort({ createdAt: -1 })
      // .skip(limit * page - queryLimit)
      // .limit(queryLimit);

      if (result) {
        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Event Request list!',
          result
        );
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'Event Request not found!',
          {}
        );
      }


    }
    catch(error){
      res.status(500).json(error);
    }
  },

  getEventDetails: async (req, res) => {
    try {
      let { user } = req;
      let userId = user._id.toString();

      let { eventId } = req.body;
      console.log('eventId: ', eventId);
      const event = await models.event.findOne({ _id: eventId });

      // console.log("event: ", event)
      // console.log("event: ", event._id)
      const dataPayload = {}
      if(event){
        console.log("game on ha")
                 
        let eventDetails =
        await  
    //     models.event.aggregate([
    //       {$match : {_id : mongoose.Types.ObjectId(eventId)}},
    //       {
    //         $lookup: {
    //           from: 'vipcards',
    //           localField: '_id',
    //           foreignField: 'eventId',
    //           pipeline: [{ $project: { cards: 1, userId, _id: 0 } }],
    //           as: 'vips',
    //         },
    //       },
    //       { $unwind: { path: '$vips', preserveNullAndEmptyArrays: true } },
    //       {
    //         $lookup: {
    //           from: 'users',
    //           localField: 'userId',
    //           foreignField: '_id',
    //           pipeline: [
    //             {
    //               $lookup:{
    //                 from: "userprofiles",
    //                 localField: "_id",
    //                 foreignField: "userId",
    //                 as: "profile"
    //               }
    //             },
    //             {$unwind: {path: "$profile" , preserveNullAndEmptyArrays: true}},
    //             {
    //               $project: {
    //                 profile: { 
    //                   profileImage:  "$profile.profileImage",
    //                   description:"$profile.description",
    //                   age: "$profile.age",
    //                   gender: "$profile.gender",
    //                   phoneNumber: "$profile.phoneNumber",
    //                   location: "$profile.location",
    //                   hobbies: "$profile.hobbies",
    //                   interests : "$profile.interests",
    //                   isPrivate : "$profile.isPrivate",
    //                   phoneCode:"$profile.phoneCode",
    //                 },
    //                 username: 1,
    //                 email: 1,
    //                 _id: 1
    //               }
    //             }
    //           ],
    //           as: 'userDetail',
    //         },
    //       },
    //       {$unwind: {path: "$userDetail" , preserveNullAndEmptyArrays: true}},
    //       {
    //         $project: {
    //           _id: 0,
    //           maleCount: {
    //             $size: {
    //               $filter: {
    //                 input: '$participants',
    //                 as: 'participant',
    //                 cond: { $eq: ['$$participant.gender', 'male'] },
    //               },
    //             },
    //           },
    //           femaleCount: {
    //             $size: {
    //               $filter: {
    //                 input: '$participants',
    //                 as: 'participant',
    //                 cond: { $eq: ['$$participant.gender', 'female'] },
    //               },
    //             },
    //           },
    //           'vips.cards': 1,
    // // Include fields from the 'users' collection
    // 'userDetail.username': 1,
    // 'userDetail.email': 1,
    // // Include fields from the 'userprofiles' collection
    // 'userDetail.profile.profileImage': 1,
    // 'userDetail.profile.description': 1,
    // 'userDetail.profile.age': 1,
    // 'userDetail.profile.gender': 1,
    // 'userDetail.profile.phoneNumber': 1,
    // 'userDetail.profile.location': 1,
    // 'userDetail.profile.hobbies': 1,
    // 'userDetail.profile.interests': 1,
    // 'userDetail.profile.isPrivate': 1,
    // 'userDetail.profile.phoneCode': 1,
    //         },
    //       },
    //     ])


    models.event.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(eventId) } },
      {
        $lookup: {
          from: 'vipcards',
          localField: '_id',
          foreignField: 'eventId',
          pipeline: [
            { $project: { cards: 1, userId: 1, _id: 0 } }
          ],
          as: 'vips'
        }
      },
      { $unwind: { path: '$vips', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: "userprofiles",
                localField: "_id",
                foreignField: "userId",
                as: "profile"
              }
            },
            { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                profile: {
                  profileImage: "$profile.profileImage",
                  description: "$profile.description",
                  age: "$profile.age",
                  gender: "$profile.gender",
                  phoneNumber: "$profile.phoneNumber",
                  location: "$profile.location",
                  hobbies: "$profile.hobbies",
                  interests: "$profile.interests",
                  isPrivate: "$profile.isPrivate",
                  phoneCode: "$profile.phoneCode",
                },
                username: 1,
                email: 1,
                _id: 1
              }
            }
          ],
          as: 'userDetail',
        },
      },
      { $unwind: { path: "$userDetail", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          maleCount: {
            $size: {
              $filter: {
                input: '$participants',
                as: 'participant',
                cond: { $eq: ['$$participant.gender', 'male'] },
              },
            },
          },
          femaleCount: {
            $size: {
              $filter: {
                input: '$participants',
                as: 'participant',
                cond: { $eq: ['$$participant.gender', 'female'] },
              },
            },
          },
          vips: 1,
          userDetail: 1,
        },
      },
    ]);

        // console.log("eventPayload : ",eventPayload)
        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Event Details!',
          eventDetails
        );
      } else {
        globalServices.global.returnResponse(
          res,
          400,
          true,
          'No event with that Id found',
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateUserEvent: async (req, res) => {
    try {
      let payLoad = req.body;

      let { eventId } = req.params;

      let { user } = req;
      let userId = user._id.toString();

      let event = await models.event.findOne({
        _id: eventId,
        $and: [{ userId: userId }],
      });

      if (event && event?.eventState === 'open') {
        let result = await globalServices.event.updateEvent(eventId, payLoad);

        if (result) {
          globalServices.global.returnResponse(
            res,
            200,
            false,
            'Event updated successfully!',
            result
          );
        } else {
          globalServices.global.returnResponse(
            res,
            401,
            true,
            'Failed to update Event!',
            {}
          );
        }
      } else if (event && event?.eventState !== 'open') {
        globalServices.global.returnResponse(
          res,
          401,
          true,
          'Event has started! You cannot update event now',
          {}
        );
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'user not found!',
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getMyEventList: async (req, res) => {
    try {
      let { user } = req;
      const userId = user._id.toString();
      let { limit, page } = req.query;

      limit = limit ? limit : 5;
      page = page ? page : 1;
      const queryLimit = parseInt(limit);

      let result = await models.event.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        { $skip: limit * page - queryLimit },
        { $limit: queryLimit },
        {
          $lookup: {
            from: 'vipcards',
            localField: '_id',
            foreignField: 'eventId',
            pipeline: [{ $project: { cards: 1, userId, _id: 0 } }],
            as: 'vips',
          },
        },
        { $unwind: { path: '$vips', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'userprofiles',
                  localField: '_id',
                  foreignField: 'userId',
                  as: 'profile',
                },
              },
              {
                $unwind: { path: '$profile', preserveNullAndEmptyArrays: true },
              },
              {
                $project: {
                  profile: {
                    profileImage: '$profile.profileImage',
                    description: '$profile.description',
                    age: '$profile.age',
                    gender: '$profile.gender',
                    phoneNumber: '$profile.phoneNumber',
                    location: '$profile.location',
                    hobbies: '$profile.hobbies',
                    interests: '$profile.interests',
                    isPrivate: '$profile.isPrivate',
                    phoneCode: '$profile.phoneCode',
                    joinedEvents: '$profile.joinedEvents',
                  },
                  username: 1,
                  email: 1,
                  _id: 1,
                },
              },
            ],
            as: 'userDetail',
          },
        },
        { $unwind: { path: '$userDetail', preserveNullAndEmptyArrays: true } },
      ]);

      // let result = await models.event
      //   .find({
      //     userId: userId,
      //   })
      //   .sort({ createdAt: -1 })
      //   .skip(limit * page - queryLimit)
      //   .limit(queryLimit);

      if (result) {
        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Event list!',
          result
        );
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'Event not found!',
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getMyReserveEvents: async (req, res) => {
    try {
      let { user } = req;
      const userId = user._id.toString();
      let { limit, page } = req.query;

      limit = limit ? limit : 5;
      page = page ? page : 1;
      const queryLimit = parseInt(limit);

      let result = await models.subscription.aggregate([
        { $match: { userId: userId } },
        { $sort: { createdAt: -1 } },
        { $skip: limit * page - queryLimit },
        { $limit: queryLimit },
        {
          $lookup: {
            from: 'events',
            localField: 'eventId',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'vipcards',
                  localField: '_id',
                  foreignField: 'eventId',
                  pipeline: [{ $project: { cards: 1, userId, _id: 0 } }],
                  as: 'vips',
                },
              },
              { $unwind: { path: '$vips', preserveNullAndEmptyArrays: true } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $lookup: {
                        from: 'userprofiles',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'profile',
                      },
                    },
                    {
                      $unwind: {
                        path: '$profile',
                        preserveNullAndEmptyArrays: true,
                      },
                    },
                    {
                      $project: {
                        profile: {
                          profileImage: '$profile.profileImage',
                          description: '$profile.description',
                          age: '$profile.age',
                          gender: '$profile.gender',
                          phoneNumber: '$profile.phoneNumber',
                          location: '$profile.location',
                          hobbies: '$profile.hobbies',
                          interests: '$profile.interests',
                          isPrivate: '$profile.isPrivate',
                          phoneCode: '$profile.phoneCode',
                          joinedEvents: '$profile.joinedEvents',
                        },
                        username: 1,
                        email: 1,
                        _id: 1,
                      },
                    },
                  ],
                  as: 'userDetail',
                },
              },
              {
                $unwind: {
                  path: '$userDetail',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            as: 'event',
          },
        },
        { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
      ]);

      // let result = await models.subscription
      //   .find({
      //     userId: userId,
      //   })
      //   .populate('eventId')
      //   .sort({ createdAt: -1 })
      //   .skip(limit * page - queryLimit)
      //   .limit(queryLimit);

      if (result) {
        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Reserve Event list!',
          result
        );
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'Event not found!',
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getMyEventsHistory: async (req, res) => {
    try {
      let { user } = req;
      const userId = user._id.toString();
      let { limit, page } = req.query;

      limit = limit ? limit : 5;
      page = page ? page : 1;
      const queryLimit = parseInt(limit);

      let eventPipeline = [
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'vipcards',
            localField: '_id',
            foreignField: 'eventId',
            pipeline: [{ $project: { cards: 1, userId, _id: 0 } }],
            as: 'vips',
          },
        },
        { $unwind: { path: '$vips', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'userprofiles',
                  localField: '_id',
                  foreignField: 'userId',
                  as: 'profile',
                },
              },
              {
                $unwind: { path: '$profile', preserveNullAndEmptyArrays: true },
              },
              {
                $project: {
                  profile: {
                    profileImage: '$profile.profileImage',
                    description: '$profile.description',
                    age: '$profile.age',
                    gender: '$profile.gender',
                    phoneNumber: '$profile.phoneNumber',
                    location: '$profile.location',
                    hobbies: '$profile.hobbies',
                    interests: '$profile.interests',
                    isPrivate: '$profile.isPrivate',
                    phoneCode: '$profile.phoneCode',
                  },
                  username: 1,
                  email: 1,
                  _id: 1,
                },
              },
            ],
            as: 'userDetail',
          },
        },
        { $unwind: { path: '$userDetail', preserveNullAndEmptyArrays: true } },
      ];

      let result1 = await models.event.aggregate(eventPipeline);
      // let result1 = await models.event
      //   .find({
      //     userId: userId,
      //   })
      //   .sort({ createdAt: -1 })
      //   .skip(limit * page - queryLimit)
      //   .limit(queryLimit);

      let subscriptionPipeline = [
        { $match: { userId: userId } },
        { $sort: { createdAt: -1 } },
        { $skip: limit * page - queryLimit },
        { $limit: queryLimit },
        {
          $lookup: {
            from: 'events',
            localField: 'eventId',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'vipcards',
                  localField: '_id',
                  foreignField: 'eventId',
                  pipeline: [{ $project: { cards: 1, userId, _id: 0 } }],
                  as: 'vips',
                },
              },
              { $unwind: { path: '$vips', preserveNullAndEmptyArrays: true } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $lookup: {
                        from: 'userprofiles',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'profile',
                      },
                    },
                    {
                      $unwind: {
                        path: '$profile',
                        preserveNullAndEmptyArrays: true,
                      },
                    },
                    {
                      $project: {
                        profile: {
                          profileImage: '$profile.profileImage',
                          description: '$profile.description',
                          age: '$profile.age',
                          gender: '$profile.gender',
                          phoneNumber: '$profile.phoneNumber',
                          location: '$profile.location',
                          hobbies: '$profile.hobbies',
                          interests: '$profile.interests',
                          isPrivate: '$profile.isPrivate',
                          phoneCode: '$profile.phoneCode',
                          joinedEvents: '$profile.joinedEvents',
                        },
                        username: 1,
                        email: 1,
                        _id: 1,
                      },
                    },
                  ],
                  as: 'userDetail',
                },
              },
              {
                $unwind: {
                  path: '$userDetail',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            as: 'event',
          },
        },
        { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
      ];
      let result2 = await models.subscription.aggregate(subscriptionPipeline);
      // let result2 = await models.subscription
      //   .find({
      //     userId: userId,
      //   })
      //   .populate('eventId')
      //   .sort({ createdAt: -1 })
      //   .skip(limit * page - queryLimit)
      //   .limit(queryLimit);

      const combinedResults = await Promise.all([result1, result2]);

      if (combinedResults) {
        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Reserve Event list!',
          { myEvents: result1, reserveEvents: result2 }
        );
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'Event not found!',
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },


  eventCancelByPlayer: async (req ,res) => {
    try{
      let { user } = req;
      const userId = user._id.toString();
      let { eventId } = req.body;
      let event = await models.event.findById(eventId);
      if(!event) {
        return globalServices.global.returnResponse(
          res,
          404,
          true,
          'No such event found that you requested for cancellation',
          {}
        );
      }
      if(!event?.participants.length){
        return globalServices.global.returnResponse(
          res,
          404,
          true,
          'No participants found for that event you requested for cancellation',
          {}
        );
      }
      const participant = event.participants.find(participant => participant.userId === userId)
      //check if your user id is found in the participants array
      if(event.participants && participant ){
        if(participant.isCanceledByParticipant){
          return globalServices.global.returnResponse(
            res,
            404,
            true,
            'You have already canceled this event',
            {}
          )
        }
        if(event.cancelationPolicy != 'none' && event.cancelationPolicy != 'any'  ){
          const hours = parseInt(event.cancelationPolicy.split(' ')[0])
          const startDate = moment(event.startDate)

          // Get the current time
          const currentDate  = moment(new Date());

          // Calculate the hour difference
          const hoursDiff = startDate.diff(currentDate, 'hours');

          //cancel time event remaining
          if(hours <= hoursDiff ){
            //wallet have credit valuebecause of particapante cancel there Subscription
            let wallet = await models.wallet.findOne({userId: userId})

            if(wallet){
              const creditTransaction = {
                eventId: event._id.toString(),
                transType: 'credit',
                refund: 'pending',
                amount: event.price,
                action: 'event cancel by participant',
                participateId: userId
              }

              const debitTransaction = {
                eventId: event._id.toString(),
                transType: 'debit',
                refund: '',
                amount: event.price,
                action: 'participant is refunded there price',
                ownerId: event.userId
              }

              wallet = await models.wallet.findOneAndUpdate(
                {userId: userId},
                {
                  $inc: { balance: event.price ? event.price : 0 },
                  $push: { transacrion: {...creditTransaction} },
                  // $push: { transacrion: {...debitTransaction} }
                },
                { new: true }
              )

              wallet = await models.wallet.findOneAndUpdate(
                {userId: event.userId},
                {
                  $inc: { balance: event.price ? -event.price  : 0 },
                  $push: { transacrion: {...debitTransaction} }
                },
                { new: true }
              )
              
              const updateEvent =  await models.event.findOneAndUpdate(
                {
                  participants: { $elemMatch: { userId: userId } },
                },
                { 
                  $set: { 'participants.$.isCanceledByParticipant': true }
                },
                { new: true }
              );

              const updateSubscription = await models.subscription.findOneAndUpdate(
                { userId : userId},
                { 
                  $set: { isCanceledByParticipant: true } 
                },
                { new: true }
              )

              if(updateEvent && updateSubscription && wallet){
                return globalServices.global.returnResponse(
                  res,
                  200,
                  false,
                  'You have successfully cancelled your event',
                  wallet
                );
              }else{
                return globalServices.global.returnResponse(
                  res,
                  404,
                  true,
                  'Something went wrong while Transaction!',
                  {}
                );
              }

            }else{
              return globalServices.global.returnResponse(
                res,
                404,
                true,
                'No Wallet Found with that userId!',
                {}
              );

            }
          }
          else{
            return globalServices.global.returnResponse(
              res,
              404,
              true,
              'You have not enough hours to cancel this event',
              {}
            )
          }
        }
        else{
          return globalServices.global.returnResponse(
            res,
            404,
            true,
            'You have not any cancel Policy for this event',
            {}
          );
        }
      }
      else{
        return globalServices.global.returnResponse(
          res,
          404,
          true,
          'You are not participate in this event',
          {}
        );
      }
    }
    catch(error){
      res.status(500).json(error);
    }
  },

  getPlayerCurrentBalance: async (req,res) => {
    try{
      let { user } = req;
      const userId = user._id.toString();
      let wallet = await models.wallet.findOne({userId})
      if(wallet){
        return globalServices.global.returnResponse(
          res,
          404,
          true,
          'You have successfully get your wallet!',
          wallet
        );
      }
      else{
        return globalServices.global.returnResponse(
          res,
          404,
          true,
          'There no wallet exist with that userId!',
          {}
        );
      }
    }
    catch(error){
      res.status(500).json(error);
    }
  }
};
