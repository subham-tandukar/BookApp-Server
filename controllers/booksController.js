const books = require("../models/bookSchema");

// ----add book-------
exports.bookpost = async (req, res) => {
  const {
    BookName,
    Auther,
    AgeGroup,
    Page,
    WordCount,
    Edition,
    YearPublished,
    Quantity,
    Genre,
    Status,
    FLAG,
    UserID,
  } = req.body;
  try {
    if (FLAG === "I") {
      const file = req.file.filename;
      if (!BookName || !Auther || !file) {
        res.status(401).json("Please fill the required input field");
      }
      const bookData = new books({
        BookName,
        Auther,
        AgeGroup,
        Page,
        WordCount,
        Edition,
        YearPublished,
        Quantity,
        Genre,
        Status,
        Image: file,
        UserID: UserID,
      });
      await bookData.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "S") {
      let bookdata;
      if (UserID === -1) {
        bookdata = await books.find();
        res.status(201).json({
          BookData: bookdata.length <= 0 ? "No data" : bookdata,
          StatusCode: 200,
          Message: "success",
        });
      } else {
        bookdata = await books.find({ UserID:UserID });
        res.status(201).json({
          BookData: bookdata.length <= 0 ? "No data" : bookdata,
          StatusCode: 200,
          Message: "success",
        });
      }
    } else {
      res.status(400).json({ StatusCode: 400, Message: "Invalid flag" });
    }
  } catch (error) {
    res.status(500).json({
      StatusCode: 400,
      Message: error,
    });
  }
};

// -----get book---------
exports.bookget = async (req, res) => {
  try {
    const bookdata = await books.find({ user: req.user.id });
    res.status(201).json({
      BookData: bookdata.length <= 0 ? null : bookdata,
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
