const books = require("../models/bookSchema");
const fs = require("fs");
const cloudinary = require("../cloudinary");

// ---- add book ----
exports.postBook = async (req, res) => {
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
      // const base64Data = Image.split(";base64,").pop();
      // const ext = Image.split(";")[0].split("/")[1];
      // const imageName = `book_${Date.now()}.${ext}`;
      // const buffer = Buffer.from(base64Data, "base64");

      // await fs.promises.writeFile(`uploads/${imageName}`, buffer);

      const bookImg = await cloudinary.uploader.upload(Image, {
        folder: "books",
      });

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
        Image: {
          public_id: bookImg.public_id,
          url: bookImg.secure_url,
        },
        UserID: UserID,
      });
      await bookData.save();
      res.status(201).json({
        Image: bookData.Image,
        StatusCode: 200,
        Message: "success",
      });
    } else {
      res.status(400).json({ StatusCode: 400, Message: "Invalid flag" });
    }
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: error,
    });
  }
};

// --- get book ---
exports.getBook = async (req, res) => {
  try {
    const UserID = req.query.UserID;
    const Status = req.query.Status;
    const Search = req.query.Search;

    let query = {};

    if (Search) {
      query.$or = [
        { BookName: { $regex: Search, $options: "i" } }, // search by Title
        { Auther: { $regex: Search, $options: "i" } }, // search by Author
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;

    let bookdata;
    if (UserID === "-1" && Status === "-1") {
      bookdata = await books.find(query).skip(startIndex).limit(limit);
      res.status(201).json({
        Values: bookdata.length <= 0 ? null : bookdata,
        StatusCode: 200,
        Message: "success",
      });
    } else if (UserID && Status === "-1") {
      bookdata = await books
        .find({ query, UserID: UserID })
        .skip(startIndex)
        .limit(limit);
      res.status(201).json({
        Values: bookdata.length <= 0 ? null : bookdata,
        StatusCode: 200,
        Message: "success",
      });
    } else if (Status && UserID === "-1") {
      bookdata = await books
        .find({ query, Status: Status })
        .skip(startIndex)
        .limit(limit);
      res.status(201).json({
        Values: bookdata.length <= 0 ? null : bookdata,
        StatusCode: 200,
        Message: "success",
      });
    } else if (UserID && Status) {
      bookdata = await books
        .find({ query, UserID: UserID, Status: Status })
        .skip(startIndex)
        .limit(limit);
      res.status(201).json({
        Values: bookdata.length <= 0 ? null : bookdata,
        StatusCode: 200,
        Message: "success",
      });
    } else {
    }
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: "User does not exist",
    });
  }
};
