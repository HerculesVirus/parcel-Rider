const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');

const {
  pwdSaltRounds,
  jwtExpirationInterval,
  pwEncryptionKey,
} = require('../../config/vars');

/**
 * User Schema
 * @private
 */
let UserSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String }, //random string  to genrate
    googleVerified: { type: Boolean, default: false },
    appleVerfified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'business', 'admin'], required: true },
    platformID: { type: String }, // googleToken || AppleID
    refreshTokens: [
      {
        token: { type: String, required: true }, //RefreshToken for multiple Device Login
        expiresAt: { type: Date, required: true }, //expAt
      },
    ],
    isVerified: { type: Boolean, default: false }, //otp check
    isProfile: { type: Boolean, default: false }, //userProfile is created or NOT with that userId
    status: { type: Boolean }, // false: inactive, true: active
    isPartnerCreated: { type: Boolean, default: false }, // boolean when user become  a partner
  },
  { timestamps: true }
);

/**
 * Methods
 */

UserSchema.method({
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password);
  },

  token() {
    console.log('Hit token function: ');
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    console.log('playload: ', playload);
    return jwt.encode(playload, pwEncryptionKey);
  },
});

UserSchema.pre('save', async function save(next) {
  try {
    const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
    if (this.password) {
      if (!this.isModified('password')) return next();
      const hash = await bcrypt.hash(this.password, rounds);
      this.password = hash;
    }

    let user = await mongoose
      .model('User', UserSchema)
      .findOne()
      .limit(1)
      .sort({ createdAt: -1 });

    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
    if (this._update['$set']?.password) {
      const hash = await bcrypt.hash(this._update['$set']?.password, rounds);
      this._update.password = hash;
    }
    return next();
  } catch (e) {
    return next(e);
  }
});

/**
 * @typedef User
 */

module.exports = mongoose.model('User', UserSchema);
