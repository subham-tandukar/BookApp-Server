const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    BookName: {
      type: String,
      required: true,
    },
    Auther: {
      type: String,
      required: true,
    },
    AgeGroup: {
      type: String,
    },
    Page: {
      type: Number,
    },
    WordCount: {
      type: Number,
    },
    Edition: {
      type: Number,
    },
    YearPublished: {
      type: Number,
    },
    Quantity: {
      type: Number,
    },
    Genre: {
      type: String,
    },
    Status: {
      type: String,
    },
    Image: {
      type: String,
    },
  },
  { timestamps: true }
);

const books = new mongoose.model("book", bookSchema);

module.exports = books;
