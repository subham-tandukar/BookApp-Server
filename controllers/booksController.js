const books = require("../models/bookSchema");
const fs = require("fs");
const cloudinary = require("../cloudinary");

// ---- add book ----
exports.postBook = async (req, res) => {
  const {
    BookID,
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
        UserID,
      });
      await bookData.save();
      res.status(201).json({
        Image: bookData.Image,
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "U") {
      let urlRegex =
        /^(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&amp;:/~+#-]*$/;

      // Check if the URL matches the regex pattern
      const changeImage = urlRegex.test(Image);

      let bookImg;

      if (!changeImage) {
        const updateBook = await books.findById({ _id: BookID });

        await cloudinary.uploader.destroy(updateBook.Image.public_id);

        bookImg = await cloudinary.uploader.upload(Image, {
          folder: "books",
        });
      }

      let update;

      if (changeImage === false) {
        update = {
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
          UserID,
        };
      } else {
        update = {
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
          UserID,
        };
      }

      await books.findByIdAndUpdate(BookID, update, {
        new: true,
      });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "D") {
      const deleteBook = await books.findByIdAndDelete({ _id: BookID });

      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(deleteBook.Image.public_id);

      res.status(201).json({
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
    // const Search = req.query.Search;

    // let query = {};

    // if (Search) {
    //   query.$or = [
    //     { BookName: { $regex: Search, $options: "i" } },
    //     { Auther: { $regex: Search, $options: "i" } },
    //   ];
    // }

    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 6;
    // const startIndex = (page - 1) * limit;

    let bookdata;
    if (UserID === "-1" && Status === "-1") {
      // bookdata = await books.find(query).skip(startIndex).limit(limit);
      bookdata = await books.find().sort({ createdAt: -1 });
      res.status(201).json({
        Values: bookdata.length <= 0 ? null : bookdata,
        StatusCode: 200,
        Message: "success",
      });
    } else if (UserID && Status === "-1") {
      bookdata = await books.find({ UserID: UserID }).sort({ createdAt: -1 });
      // .skip(startIndex)
      // .limit(limit);
      res.status(201).json({
        Values: bookdata.length <= 0 ? null : bookdata,
        StatusCode: 200,
        Message: "success",
      });
    } else if (Status && UserID === "-1") {
      bookdata = await books.find({ Status: Status }).sort({ createdAt: -1 });
      // .skip(startIndex)
      // .limit(limit);
      res.status(201).json({
        Values: bookdata.length <= 0 ? null : bookdata,
        StatusCode: 200,
        Message: "success",
      });
    } else if (UserID && Status) {
      bookdata = await books
        .find({ UserID: UserID, Status: Status })
        .sort({ createdAt: -1 });
      // .skip(startIndex)
      // .limit(limit);
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
