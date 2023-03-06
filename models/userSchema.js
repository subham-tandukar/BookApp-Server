const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      default: "Unverified",
    },
    OTP: {
      type: String,
    },
  },
  { timestamps: true }
);

const users = new mongoose.model("user", userSchema);

module.exports = users;
