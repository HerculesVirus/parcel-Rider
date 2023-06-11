const express = require('express');
const orderController = require('../../../controller/mobile/order.controller');
const router = express.Router();

const { userValidation } =require('../../../middleware/auth')
router.route('/create-order').post(orderController.createOrder)
router.route('/get-all-orders').post(orderController.getAllOrders)
router.route('/my-orders').get(userValidation , orderController.getMyOrders)
router.route('/update-order').put(userValidation , orderController.updateOrderDetails)


module.exports = router;