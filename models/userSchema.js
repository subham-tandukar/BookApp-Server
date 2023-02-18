const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    UserID: { type: Number, required: true },
  },
  { timestamps: true }
);

userSchema.plugin(autoIncrement.plugin, {
  model: "user",
  field: "UserID",
  startAt: 1,
});

module.exports = mongoose.model("user", userSchema);
