const Models = {};

Models.user = require('./users.model');
Models.event = require('./event.model');
Models.vipCard = require('./vipcard.model');
Models.subscription = require('./subscription.model');
Models.userProfile = require('./userProfile.model');
Models.stripePayment = require('./stripePayment.Modal');
Models.membership = require('./membership.model');
Models.membershipPayments = require('./membershipPayments.model');
Models.eTicket = require('./eTicket.model');
Models.partner = require('./partner.model');
Models.settings = require('./settings.model');
Models.support = require('./support.model');
Models.Faq = require('./faq.model')
Models.wallet = require('./wallet.model')
module.exports = Models;
