const books = require("../models/bookSchema");
const fs = require("fs");

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
    Description,
    FLAG,
    UserID,
    Image,
  } = req.body;
  try {
    if (FLAG === "I") {
      const base64Data = Image.split(";base64,").pop();
      const ext = Image.split(";")[0].split("/")[1];
      const imageName = `book_${Date.now()}.${ext}`;
      const buffer = Buffer.from(base64Data, "base64");
    
      await fs.promises.writeFile(`uploads/${imageName}`, buffer);

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
        Description,
        Image: imageName,
        UserID: UserID,
      });
      await bookData.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "S") {
      let bookdata;
      if (UserID === "-1") {
        bookdata = await books.find();
        res.status(201).json({
          BookData: bookdata.length <= 0 ? null : bookdata,
          StatusCode: 200,
          Message: "success",
        });
      } else {
        bookdata = await books.find({ UserID: UserID });
        res.status(201).json({
          BookData: bookdata.length <= 0 ? null : bookdata,
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
