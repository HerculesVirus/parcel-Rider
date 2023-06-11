const globalServices = require("../../services/index");
const moment = require("moment");

const models = require("../../model");
const mongoose = require("mongoose");

module.exports = {
  createOrder: async (req, res) => {
    try {
      const { shopName, shopLocation, riderId, riderName } = req.body;
      const itemList = req.body.itemList || [];
      const order = await models.order.create({
        shopName,
        shopLocation,
        riderId,
        riderName,
        itemList,
      });
      if (!order) {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          "Order creation failed",
          {}
        );
      } else {
        globalServices.global.returnResponse(
          res,
          201,
          true,
          "Order created successfully",
          order
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllOrders: async (req, res) => {
    try {
      let { page, limit } = req.query;
      console.log("orders: List APi hit", page, "limit: " + limit);
      let { riderName, riderId, shopName, createdAtFrom, createdAtTo } =
        req.body;
      const filter = {};

      if (riderId) {
        riderId = riderId.trim();
        filter.riderId = mongoose.Types.ObjectId(riderId);
      }

      if (riderName) {
        riderName = riderName.trim();
        filter.riderName = {
          $regex: riderName.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
          $options: "i",
        };
      }

      if (shopName) {
        shopName = shopName.trim();
        filter.shopName = {
          $regex: shopName.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
          $options: "i",
        };
      } else if (createdAtFrom) {
        let startDate = moment
          .utc(new Date(createdAtFrom))
          .add(1, "day")
          .format("YYYY-MM-DD");
        filter.createdAt = { $gte: new Date(startDate) };
      } else if (createdAtTo) {
        let endDate = moment
          .utc(new Date(createdAtTo))
          .add(2, "day")
          .format("YYYY-MM-DD");
        filter.createdAt = { $lte: new Date(endDate) };
      }

      console.log("------------");
      console.log("Filter:", filter);
      console.log("------------");

      page = page !== undefined && page !== "" ? parseInt(page) : 1;
      limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

      const total = await models.order.countDocuments(filter);
      console.log("total: ", total);

      if (page > Math.ceil(total / limit) && total > 0)
        page = Math.ceil(total / limit);

      let pipeline = [{ $match: filter }, { $sort: { createdAt: -1 } }];

      pipeline.push({ $skip: limit * (page - 1) });
      pipeline.push({ $limit: limit });

      const orders = await models.order.aggregate(pipeline);
      if (!orders) {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          "Orders not found",
          {}
        );
      } else {
        globalServices.global.returnResponse(
          res,
          200,
          true,
          "Orders list fetched successfully",
          {
            orders,
            pagination: {
              page,
              limit,
              total,
              pages:
                Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
            },
          }
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getMyOrders: async (req, res) => {
    try {
      let { page, limit } = req.query;
      let { user } = req;
      let riderId = user._id.toString();
      console.log("orders: List APi hit", page, "limit: " + limit);

      page = page !== undefined && page !== "" ? parseInt(page) : 1;
      limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

      const total = await models.order.countDocuments({ riderId });
      console.log("total: ", total);

      if (page > Math.ceil(total / limit) && total > 0)
        page = Math.ceil(total / limit);

      const myOrders = await models.order
        .find({ riderId })
        .sort({ createdAt: -1 })
        .skip(limit * (page - 1))
        .limit(limit);

      if (!myOrders) {
        globalServices.global.returnResponse(
          res,
          404,
          true,
          "Orders not found",
          {}
        );
      } else {
        globalServices.global.returnResponse(
          res,
          200,
          true,
          "Orders list fetched successfully",
          {
            myOrders,
            pagination: {
              page,
              limit,
              total,
              pages:
                Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
            },
          }
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateOrderDetails: async (req, res) => {
    try {
      let { user } = req;
      let riderId = user._id.toString();
      const { orderId , status} = req.body;
      const order = await models.order.findOneAndUpdate(
        {_id :  mongoose.Types.ObjectId(orderId) , riderId},
        { status },
        { new: true }
      );
      if(order){
        globalServices.global.returnResponse(
          res,
          200,
          true,
          "Order updated successfully",
          order
        );
      }
      else{
        globalServices.global.returnResponse(
          res,
          404,
          true,
          "Order not found",
          {}
        );
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
