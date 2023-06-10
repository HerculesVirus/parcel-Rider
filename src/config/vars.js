const path = require('path');
// import .env variables
require('dotenv').config();
module.exports = {
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  encryptionKey: process.env.ENCRYPTION_KEY,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  // frontEncSecret: process.env.FRONT_ENC_SECRET,
  // adminUrl: process.env.ADMIN_URL,
  // playerUrl:process.env.PLAYER_URL,
  // developerUrl:process.env.DEVELOPER_URL,
  // userUrl:process.env.USER_URL,
  emailAdd: process.env.EMAIL,
  PROJECT_ID: process.env.PROJECT_ID,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  // appName: process.env.APPLICATION_NAME,
  // providerAddress: process.env.PROVIDER_ADDRESS,
  mongo: {
    uri: process.env.MONGO_URI_LOCAL,
  },
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunApi: process.env.MAILGUN_API,
  pwEncryptionKey: process.env.PW_ENCRYPTION_KEY,
  // pwdSaltRounds: process.env.PWD_SALT_ROUNDS,
  // globalImgPlaceholder: '/img/placeholder.png',
  // uploadedImgPath: process.env.UPLOADED_IMAGE_BASE_URL,
  // baseUrl: process.env.BASE_URL,
  // realCurrenyLabel: process.env.REAL_CURRENCY_LABEL,
  // realCurrenyType: process.env.REAL_CURRENCY_TYPE,
  // tokenNameToValue: {
  //   'ANN': 1,
  //   'WBNB': 2
  // },
  // adminPasswordKey: process.env.ADMIN_PASSWORD_KEY,
  xAuthToken: process.env.XAUTHTOKEN,
  authorization: process.env.AUTHORIZATION,
};
