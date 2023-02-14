const books = require("../models/bookSchema");

// ----add book-------
exports.bookpost = async (req, res) => {
  const file = req.file.filename;
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
  } = req.body;

  if (!BookName || !Auther || !file) {
    res.status(401).json("Please fill the required input field");
  }

  try {
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
    });
    await bookData.save();
    res.status(201).json({
      StatusCode: 200,
      Message: "success",
    });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
};

// -----get book---------
exports.bookget = async (req, res) => {
  try {
    const bookdata = await books.find();
    res.status(201).json({
      BookData: bookdata.length <= 0 ? null : bookdata,
      StatusCode: 200,
      Message: "success",
    });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
};
