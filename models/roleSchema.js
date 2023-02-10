const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
    },

    role: [
      { read: Boolean, write: Boolean, update: Boolean, deleted: Boolean },
    ],

    permission: [
      { read: Boolean, write: Boolean, update: Boolean, deleted: Boolean },
    ],

    user: [
      { read: Boolean, write: Boolean, update: Boolean, deleted: Boolean },
    ],

    form: [
      { read: Boolean, write: Boolean, update: Boolean, deleted: Boolean },
    ],

    filter: [
      { read: Boolean, write: Boolean, update: Boolean, deleted: Boolean },
    ],

    sortable: [
      { read: Boolean, write: Boolean, update: Boolean, deleted: Boolean },
    ],

    slideshow: [
      { read: Boolean, write: Boolean, update: Boolean, deleted: Boolean },
    ],
  },
  { timestamps: true }
);

const roles = new mongoose.model("roles", roleSchema);

module.exports = roles;
