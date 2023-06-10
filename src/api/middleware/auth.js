



const byPassedRoutes = [
    '/v1/mobile/auth/forget-password',
    '/v1/mobile/auth/reset-password',
    '/v1/mobile/auth/signin',
    '/v1/mobile/auth/signup',
    '/v1/mobile/auth/google',
    '/v1/mobile/auth/forgot-password',
    '/v1/mobile/sdk/setup-notification',
    '/v1/mobile/theme/get-theme-data',
    '/v1/mobile/auth/verify-otp/',
    '/v1/mobile/users/google'
]



const jwt = require('jsonwebtoken');

const { pwEncryptionKey, frontEncSecret } = require('../../config/vars');
const CryptoJS = require("crypto-js");
const User = require('../model/users.model');


exports.authenticate = async (req, res, next) => {
  
    if (req.originalUrl.indexOf("/v1/") > -1) {
        // console.log("url:",req.originalUrl)
        // console.log("byPassRoutes: ",byPassedRoutes.indexOf(req.originalUrl) > -1)
        // console.log("orifinalurl:",req.originalUrl.indexOf("/v1/mobile/users/google") > -1)
        // console.log("resut:",byPassedRoutes.indexOf(req.originalUrl) > -1 || req.originalUrl.indexOf("/v1/xyz") > -1 || req.originalUrl.indexOf("/v1/mobile/users/google") > -1 )
        if (byPassedRoutes.indexOf(req.originalUrl) > -1 || req.originalUrl.indexOf("/v1/xyz") > -1 || req.originalUrl.indexOf("/v1/mobile/users/google") > -1 ) {
            console.log("here we go")
            next();
        }
        else {
            let token;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
              ) {
                try {
                  token = req.headers.authorization.split(" ")[1];
                  const authorizedData = await jwt.verify(token, pwEncryptionKey);
                  req.user = authorizedData.sub
                  let user = await User.findById({ _id: req.user }).lean();
                    if (!user) {
                        return res.send({ success: false, user404: true, message: 'There is no account linked to that id', notExist: 1 });
                    }
                    else{
                        next();
                    }
                  
                } catch (error) {
                    return res.status(400).json({ success: false, message:"Invalid Token"});
                }
              }
            
                if (!token) {
                    return res.status(400).json({ success: false, message:'Token not found' });
                }
            }
    }
    else{
        return res.status(400).json({ success: false, message:"Your route path is Invalid"});
    }
 }

 exports.userValidation = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          token = req.headers.authorization.split(" ")[1];
          const authorizedData = await jwt.verify(token, pwEncryptionKey);
          req.user = authorizedData;
          let user = await User.findById({ _id: req.user.sub }).lean();

            if (!user) {
                return res.send({ success: false, user404: true, message: 'There is no account linked to that id', notExist: 1 });
            }
            else{
                req.user = user;
                next();
            }
          
        } catch (error) {
            return res.status(400).json({ success: false, message:"Invalid Token"});
        }
      }
    
        if (!token) {
            return res.status(400).json({ success: false, message:'Token not found' });
        }
}
