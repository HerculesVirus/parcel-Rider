const models = require('../../model');
const globalServices = require('../../services/index');
const randomOrderId = require('../../utils/global');
const User = require('../../model/users.model');
const mongoose = require('mongoose');

module.exports = {
  subscribeEvent: async (req, res) => {
    const { user } = req;
    let userId = user._id.toString();

    const { eventId } = req.params;
    const { genderType, price, VipCardName, vipCardId } = req.body;

    try {
      const participant = await models.userProfile.findOne({ userId: userId });

      if (participant) {
        const participantId = participant._id.toString();

        const event = await models.event.findOne({
          _id: eventId,
        });

        const ownerUserId = event.userId;

        if (event) {
          const participantIdExists = event.participants.some(
            (participant) => participant.participantId === participantId
          );

          if (!participantIdExists) {
            const pushed = await participant.updateOne({
              $push: { joinedEvents: eventId },
            });

            if (pushed) {
              let isAcceptedObject = {
                participant: participantId,
                eventId: eventId,
                eventOwner: ownerUserId,
                eventName: event.name,
                isAcceptedByOwner: 'pending',
                userId: userId.toString(),
                subscriptionType: 'event',
                genderType: genderType,
                price: price,
                VipCardName: VipCardName,
                vipCardId: vipCardId,
                userProfile: participantId,
              };

              await models.subscription.create(isAcceptedObject);

              const subscription = await models.subscription.findOne({
                participant: participantId,
                eventId: eventId,
              });

              const playerStatus = subscription?.isAcceptedByOwner;

              let playerObject = {
                participantId: participantId,
                fullName: participant.fullName,
                profile: participant.profileImage,
                isAcceptedByOwner: playerStatus,
                userId: userId,
                gender: participant.gender,
                isCanceledByParticipant: subscription?.isCanceledByParticipant,
              };

              await models.event.findOneAndUpdate(
                { _id: eventId },
                {
                  $push: { participants: { ...playerObject } },
                },
                { new: true }
              );

              const orderId = randomOrderId.gererateOrderId();

              let eTicketObject = {
                eventId: eventId,
                userId: subscription?.userId,
                eventName: subscription?.eventName,
                place: event?.place,
                price: price,
                orderId: orderId,
                dateAndTime: event?.startDate,
                VipCardName: VipCardName,
                genderType: genderType,
                vipCardId: vipCardId,
              };

              const eTicket = await models.eTicket.create(eTicketObject);

              const walletObj = {
                userId: userId,
                eventId: eventId.toString(),
                transacrion: [
                  {
                    transType: 'debit',
                    amount: price,
                    action: 'event subscribed by participant',
                  },
                ],
              };
              await models.wallet.create(walletObj);

              globalServices.global.returnResponse(
                res,
                200,
                false,
                'You have subscribed this event successfully! Check your eTicket!',
                eTicket
              );
            }
          } else {
            globalServices.global.returnResponse(
              res,
              403,
              false,
              'you have allready subscribed this event!'
            );
          }
        } else {
          globalServices.global.returnResponse(
            res,
            404,
            false,
            'Event not found!'
          );
        }
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          false,
          'No participant found!',
          {}
        );
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  becomeAPartner: async (req, res) => {
    const { user } = req;
    const userId = user._id.toString();
    let payLoad = req.body;
    try {
      const partner = await models.partner.findOne({
        userId: userId,
      });

      if (!partner) {
        Object.assign(payLoad, {
          userId: userId,
        });
        const result = await globalServices.event.partnerCreation(payLoad);

        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Your request successfully submitted to become a partner! Wait for admin approval',
          result
        );

        // await User.findOneAndUpdate(
        //   { _id: userId },
        //   {
        //     isPartnerCreated: true,
        //   },
        //   { new: true }
        // );

        // await models.userProfile.findOneAndUpdate(
        //   { userId: userId },
        //   {
        //     isPartnerCreated: true,
        //   },
        //   { new: true }
        // );
      } else {
        globalServices.global.returnResponse(
          res,
          403,
          false,
          'You have already become a partner!',
          {}
        );
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  adminApprovalForPartner: async (req, res) => {
    const { user } = req;
    const userRole = user.role;
    let payLoad = req.body;

    if (userRole !== 'admin') {
      res.status(401).send({
        error: true,
        status: 401,
        msg: 'Only admin can approve or reject!',
      });
      return;
    }

    try {
      const partner = await models.partner.findOne({
        userId: payLoad.userId,
      });

      if (!partner) {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'No request found for partner!',
          {}
        );
        return;
      }

      if (payLoad.isApproved === true) {
        await models.partner.findOneAndUpdate(
          { _id: partner._id },
          {
            isApprovedByAdmin: true,
          },
          { new: true }
        );

        await User.findOneAndUpdate(
          { _id: payLoad.userId },
          {
            isPartnerCreated: true,
          },
          { new: true }
        );

        await models.userProfile.findOneAndUpdate(
          { userId: payLoad.userId },
          {
            isPartnerCreated: true,
          },
          { new: true }
        );

        const updatedPartner = await models.partner.findOne({
          _id: partner._id,
        });

        globalServices.global.returnResponse(
          res,
          200,
          false,
          'Approved partner by admin!',
          updatedPartner
        );
      }
      if (payLoad.isApproved === false) {
        globalServices.global.returnResponse(
          res,
          200,
          true,
          'Rejected by admin to approve a partner!',
          {}
        );
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  subscribeMembership: async (req, res) => {
    const { user } = req;
    const userId = user._id.toString();
    let payLoad = req.body;
    try {
      const participant = await models.userProfile.findOne({ userId: userId });

      if (participant) {
        const participantId = participant._id.toString();

        const membership = await models.membership.findOne({
          userId: userId,
        });

        if (!membership) {
          Object.assign(payLoad, {
            userId: userId,
            participant: participantId,
          });
          const result = await globalServices.event.createMembershipByUser(
            payLoad
          );

          console.log('result..', result);

          await models.subscription.updateMany(
            { userId: result?.userId }, // Filter
            { $set: { membershipType: result?.membershipType } } // Update operation
          );

          const subs = await models.subscription.findOne({
            userId: result?.userId,
          });

          await models.event.findOneAndUpdate(
            {
              _id: subs?.eventId,
              participants: { $elemMatch: { userId: subs?.userId } },
            },

            {
              $set: {
                'participants.$.membershipType': subs?.membershipType,
              },
            },
            { new: true }
          );

          await models.userProfile.findOneAndUpdate(
            { userId: mongoose.Types.ObjectId(subs?.userId) },
            { $set: { membershipType: subs?.membershipType } },

            { new: true }
          );

          globalServices.global.returnResponse(
            res,
            200,
            false,
            'You have subscribed this membership successfully!',
            result
          );
        } else {
          globalServices.global.returnResponse(
            res,
            403,
            false,
            'You have already subscribed membership!',
            {}
          );
        }
      } else {
        globalServices.global.returnResponse(
          res,
          401,
          false,
          'You have not setup your profile yet'
        );
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  playerSubscriptionStatusUpdate: async (req, res) => {
    try {
      let { participantId, eventId, status } = req.body;
      let { user } = req;
      const userId = user._id.toString();

      const playerId = participantId.toString();
      const event = eventId.toString();

      let player = await globalServices.user.findSubscribedPlayer(
        playerId,
        event
      );

      const eventOwner = player?.eventOwner.toString();
      if (eventOwner !== userId) {
        res.status(400).send({
          error: true,
          status: 400,
          msg: 'Only Event owner can accept or reject user participat!',
        });
        return;
      }

      const id = player._id.toString(); // subscription _id

      if (player && player.isAcceptedByOwner === 'pending') {
        let result = await globalServices.user.updatePlayerSubscription(
          id,
          status
        );

        if (result && status === 'accept') {
          await models.event.findOneAndUpdate(
            {
              _id: event,
              participants: { $elemMatch: { userId: player.userId } },
            },

            { $set: { 'participants.$.isAcceptedByOwner': 'accept' } },
            { new: true }
          );

          globalServices.global.returnResponse(
            res,
            200,
            false,
            'User has accepted by Owner!',
            {}
          );
        } else if (result && status === 'reject') {
          await models.event.findOneAndUpdate(
            {
              _id: event,
              participants: { $elemMatch: { userId: player.userId } },
            },

            { $set: { 'participants.$.isAcceptedByOwner': 'reject' } },
            { new: true }
          );

          const refundObject = {
            transType: 'credit',
            amount: player?.price,
            refund: 'pending',
            action: 'participant rejected by owner',
          };

          await models.wallet.findOneAndUpdate(
            {
              userId: player?.userId.toString(),
              eventId: event,
            },
            {
              $set: { balance: player?.price },
              $push: { transacrion: { ...refundObject } },
            },
            { new: true }
          );

          globalServices.global.returnResponse(
            res,
            200,
            false,
            'User has rejected by Owner! payment will be sent to your wallet',
            {}
          );

          // const updateWallet = await models.wallet.findOneAndUpdate

          // const refunded = await globalServices.stripe.paymentRefundToPlayer(
          //   playerUserId.user,
          //   eventId
          // );

          // console.log('refunded to player', refunded);

          // if (refunded.status === 'succeeded') {
          //   globalServices.global.returnResponse(
          //     res,
          //     200,
          //     false,
          //     'Sei rifiutato da fitner e i tuoi pagamenti sono stati rimborsati',
          //     {}
          //   );
          // } else {
          //   globalServices.global.returnResponse(
          //     res,
          //     400,
          //     true,
          //     'Something went wrong while refunded payments by stripe!',
          //     {}
          //   );
          //   return;
          // }
        } else {
          globalServices.global.returnResponse(
            res,
            401,
            true,
            'status is not valid!',
            {}
          );
        }
      } else if (player.isAcceptedByOwner === 'accept') {
        globalServices.global.returnResponse(
          res,
          401,
          true,
          'User has already accepted!',
          {}
        );
      } else if (player.isAcceptedByOwner === 'reject') {
        globalServices.global.returnResponse(
          res,
          401,
          true,
          'User has already rejected!',
          {}
        );
      } else {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          'User or event not exist with this id!',
          {}
        );
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
