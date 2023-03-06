const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  OTP: {
    type: String,
    required: true,
  },
});

const otp = new mongoose.model("otp", otpSchema);

module.exports = otp;
