const User = require('../../model/users.model');
const config = require('../../../config/vars');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { sendEmail } = require('../../utils/emails/emails');
const randomstring = require('randomstring');
const mongoose = require('mongoose');
// const { uploadToCloudinary } = require('../../utils/upload');
var CryptoJS = require('crypto-js');
const globalServices = require('../../services/index');
const Mail = require('../../model/email.model');
const mailGun = require('nodemailer-mailgun-transport');
const bcrypt = require('bcryptjs');
// const email=require('../../utils/emails/emails')
//GOOGLEOAuth

// const { login } = require('./auth');
const { verify } = require('jsonwebtoken');


/**
 * Returns jwt token if valid email and password is provided
 * @public
 */
exports.sigin = async (req, res, next) => {
  try {
    
    let { email, password, role } = req.body;

    if (email) email = email.toLowerCase();

    if (email && password && role) {
        
        const user = await User.findOne({email});
        console.log("user: ",user)
        if(!user){
             // unregistered email
            return globalServices.global.returnResponse(
                res,
                400,
                true,
                'Incorrect email',
                {}
              ); 
        }
        if (user && user.password === undefined){
        // unregistered email
        return globalServices.global.returnResponse(
            res,
            400,
            true,
            'User does not exist!',
            {}
          ); 
        // return done(null, false, {
        //     status: false,
        //     message: 'User does not exist!',
        //   });
        }
        else if (!user.verifyPassword(password)){
            // wrong password
            return globalServices.global.returnResponse(
                res,
                400,
                true,
                'Incorrect password',
                {}
            );
        }
        else if (user.role != "admin") {
        //wrong userType
        return globalServices.global.returnResponse(
            res,
            400,
            true,
            'Incorrect userType',
            {}
          );
        // return done(null, false, {
        //   status: false,
        //   message: 'Incorrect userType',
        // });
        } 
    //   if(!user.isVerified){ //when user not verified
    //     const data = {
    //       userId: user._id,
    //       isVerified : user.isVerified ,
    //       isProfile : user.isProfile
    //     };

    //     return globalServices.global.returnResponse(
    //       res,
    //       200,
    //       false,
    //       'You have not verified yet',
    //       data
    //     );
    //   }
      var accessToken = await user.token();
      let data = {
        accessToken,
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified : user.isVerified ,
        isProfile : user.isProfile
      };
      console.log("data: ",data)
      return globalServices.global.returnResponse(
        res,
        200,
        false,
        'You have logged in successfully',
        data
      );
      // call for passport authentication
    //   passport.authenticate('local', async (err, user, info) => {
    //     if (err){
    //       return globalServices.global.returnResponse(
    //         res,
    //         400,
    //         true,
    //         'Oops! Something went wrong while authenticating',
    //         {}
    //       );
    //     }
    //     else if (user ) {
    //         console.log("here we are")
          
    //       // return res.status(200).send({
    //       //   status: true,
    //       //   message: 'You have logged in successfully',
    //       //   data,
    //       // });
    //     }
    //     // unknown user or wrong password
    //     else{
    //       return globalServices.global.returnResponse(
    //         res,
    //         200,
    //         false,
    //         'Incorrect Email, Password or userType ',
    //         {}
    //       );
    //       // return res
    //       //   .status(200)
    //       //   .send({ status: false, message: 'Incorrect Email, Password or userType ' });
    //     }
    //   })(req, res);
    }
    else{
      return globalServices.global.returnResponse(
        res,
        200,
        false,
        'Email & password required',
        {}
      );
      // return res
      // .status(200)
      // .send({ status: false, message: 'Email & password required' });
    }
      
  } catch (error) {
    res.status(500).json(error);
  }
};

