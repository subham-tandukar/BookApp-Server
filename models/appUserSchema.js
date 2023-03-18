const mongoose = require("mongoose");

const appUserSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const appUsers = new mongoose.model("appUser", appUserSchema);

module.exports = appUsers;
