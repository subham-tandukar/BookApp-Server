const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assignUsers",
    },
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    noteStatus: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const notes = new mongoose.model("notes", noteSchema);

module.exports = notes;
