const genre = require("../models/genreSchema");
const cloudinary = require("../cloudinary");

// ---- genre ----
exports.genre = async (req, res) => {
  const { FLAG, GenreID, title, image } = req.body;

  try {
    if (FLAG === "I") {
      if (!title || !image) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      let unique = await genre.findOne({ title: title });
      if (unique) {
        return res.status(422).json({
          Message: "This genre already exist",
        });
      }
      const genreImage = await cloudinary.uploader.upload(image, {
        folder: "genre",
      });
      const genreData = new genre({
        title,
        image: {
          public_id: genreImage.public_id,
          url: genreImage.secure_url,
        },
      });
      await genreData.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        image: genreData.image,
      });
    } else if (FLAG === "U") {
      if (!title || !image) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      let urlRegex =
        /^(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&amp;:/~+#-]*$/;

      // Check if the URL matches the regex pattern
      const changeImage = urlRegex.test(image);

      let genreImage;

      if (!changeImage) {
        const updateGenre = await genre.findById({ _id: GenreID });

        await cloudinary.uploader.destroy(updateGenre.image.public_id);

        genreImage = await cloudinary.uploader.upload(image, {
          folder: "genre",
        });
      }

      let update;

      if (changeImage === false) {
        update = {
          title,
          image: {
            public_id: genreImage.public_id,
            url: genreImage.secure_url,
          },
        };
      } else {
        update = {
          title,
        };
      }

      await genre.findByIdAndUpdate(GenreID, update, {
        new: true,
      });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "S") {
      const showgenre = await genre
        .find()
        .select("title image")
        .sort({ createdAt: -1 });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Values: showgenre.length <= 0 ? null : showgenre,
      });
    } else if (FLAG === "D") {
      const deleteGenre = await genre.findByIdAndDelete({ _id: GenreID });

      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(deleteGenre.image.public_id);

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
