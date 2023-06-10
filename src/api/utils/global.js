module.exports = {
  createOtp: () => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  },

  gererateOrderId: () => {
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ORDERID = '';
    for (let i = 0; i < 11; i++) {
      ORDERID += digits[Math.floor(Math.random() * 10)];
    }
    return ORDERID;
  },
};
