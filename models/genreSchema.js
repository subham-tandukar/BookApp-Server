const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const genres = new mongoose.model("genre", genreSchema);

module.exports = genres;
