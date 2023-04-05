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
    Quantity,
    Language,
    Rating,
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

      if (!BookName || !Image || !Auther || !Status) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }

      if (Rating > 5) {
        return res.status(422).json({
          Message: "Rating value must be less than 5",
        });
      }
      if (Rating < 0) {
        return res.status(422).json({
          Message: "Rating value must be more than 0",
        });
      }

      const bookImg = await cloudinary.uploader.upload(Image, {
        folder: "books",
      });

      const bookData = new books({
        BookName,
        Auther,
        AgeGroup,
        Page,
        Quantity,
        Genre,
        Status,
        Language,
        Rating,
        Description,
        Image: {
          public_id: bookImg.public_id,
          url: bookImg.secure_url,
        },
        UserID,
      });
      await bookData.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Image: bookData.Image,
      });
    } else if (FLAG === "U") {
      if (!BookName || !Image || !Auther || !Status) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      let urlRegex =
        /^(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&amp;:/~+#-]*$/;

      // Check if the URL matches the regex pattern
      const changeImage = urlRegex.test(Image);

      if (Rating > 5) {
        return res.status(422).json({
          Message: "Rating value must be less than 5",
        });
      }
      if (Rating < 0) {
        return res.status(422).json({
          Message: "Rating value must be more than 0",
        });
      }

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
          Quantity,
          Language,
          Rating,
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
          Quantity,
          Language,
          Rating,
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
    } else if (FLAG === "SI") {
      const showbook = await books.findById({ _id: BookID });
      if (showbook) {
        res.status(201).json({
          StatusCode: 200,
          Message: "success",
          Values: [showbook],
        });
      } else {
        res.status(401).json({
          StatusCode: 400,
          Message: "Book not found",
        });
      }
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
    // const UserID = req.query.UserID;
    // const Status = req.query.Status;
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

    const UserID = req.query.UserID;
    const Status = req.query.Status;
    const Genres = req.query.Genres
      ? Array.isArray(req.query.Genres)
        ? req.query.Genres
        : [req.query.Genres]
      : [];

    let bookdata;
    if (UserID === "-1" && Status === "-1" && Genres.length === 0) {
      bookdata = await books.find().sort({ createdAt: -1 });
    } else if (UserID && Status === "-1" && Genres.length === 0) {
      bookdata = await books.find({ UserID: UserID }).sort({ createdAt: -1 });
    } else if (Status && UserID === "-1" && Genres.length === 0) {
      bookdata = await books.find({ Status: Status }).sort({ createdAt: -1 });
    } else if (UserID === "-1" && Status === "-1" && Genres.length !== 0) {
      bookdata = await books
        .find({
          Genre: {
            $elemMatch: { title: { $in: Genres } },
            $elemMatch: { image: { $in: Genres } },
          },
        })
        .sort({ createdAt: -1 });
    } else if (UserID === "-1" && Status && Genres.length !== 0) {
      bookdata = await books
        .find({
          Genre: {
            $elemMatch: { title: { $in: Genres } },
            $elemMatch: { image: { $in: Genres } },
          },
          Status: Status,
        })
        .sort({ createdAt: -1 });
    } else if (UserID && Status === "-1" && Genres.length !== 0) {
      bookdata = await books
        .find({
          Genre: {
            $elemMatch: { title: { $in: Genres } },
            $elemMatch: { image: { $in: Genres } },
          },
          UserID: UserID,
        })
        .sort({ createdAt: -1 });
    } else if (UserID && Status && Genres.length === 0) {
      bookdata = await books
        .find({ UserID: UserID, Status: Status })
        .sort({ createdAt: -1 });
    } else if (UserID && Status && Genres.length !== 0) {
      bookdata = await books
        .find({
          Genre: {
            $elemMatch: { title: { $in: Genres } },
            $elemMatch: { image: { $in: Genres } },
          },
          UserID: UserID,
          Status: Status,
        })
        .sort({ createdAt: -1 });
    } else {
      // Handle other cases if needed
    }
    res.status(201).json({
      StatusCode: 200,
      Message: "success",
      Values: bookdata.length <= 0 ? null : bookdata,
    });
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: "User does not exist",
    });
  }
};
