const books = require("../models/bookSchema");
const User = require("../models/userSchema");

// --- count ---
exports.count = async (req, res) => {
  try {
    // TotalBooks count------------------------
    const totalBookCt = await books.find();
    const totalBooks = totalBookCt.length;

    // BooksAvailable count------------------------
    const booksAvailableCt = await books.find({ Status: "1" });
    const booksAvailable = booksAvailableCt.length;

    // BookOut count------------------------
    const booksOutCt = await books.find({ Status: "2" });
    const bookOut = booksOutCt.length;

    // TotalUsers count------------------------
    const totalUserCt = await User.find();
    const totalUsers = totalUserCt.length;

    res.status(201).json({
      Values: [
        {
          TotalBooks: totalBooks,
          BooksAvailable: booksAvailable,
          BookOut: bookOut,
          TotalUsers: totalUsers,
        },
      ],
      StatusCode: 200,
      Message: "success",
    });
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: error,
    });
  }
};
