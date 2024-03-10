const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Profile: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    LastLoggedIn: {
      type: Date, // Field to store the last logged in date
    },
  },
  { timestamps: true }
);

const users = new mongoose.model("user", userSchema);

module.exports = users;
