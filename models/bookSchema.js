const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // UserID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "user",
    // },
    UserID: {
      type: String,
      // required: true,
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
    Quantity: {
      type: Number,
    },
    Rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
   
    Genre: [{ title: String }],
    Language: {
      type: String,
    },
    Status: {
      type: String,
    },
    Description: {
      type: String,
    },
    Image: {
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

const books = new mongoose.model("book", bookSchema);

module.exports = books;
