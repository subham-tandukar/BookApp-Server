const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const genres = new mongoose.model("genre", genreSchema);

module.exports = genres;
