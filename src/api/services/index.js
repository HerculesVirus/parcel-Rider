const globalServices = {};

globalServices.global = require('./global.services');
globalServices.event = require('./event.services');
globalServices.card = require('./card.services');
globalServices.user = require('./user.services');
globalServices.userProfile = require('./userProfile.services')
globalServices.stripe = require('./stripe.services');
module.exports = globalServices;
