let packages = {};
packages.express = require('express');
packages.path = require('path');
packages.cors = require('cors');

// *********************************************************************

packages.app = require('express')();
packages.session = require('express-session');

// packages.stripe = require('stripe')(process.env.STRIP_KEY);

module.exports = packages;
