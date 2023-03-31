const genre = require("../models/genreSchema");

// ---- add book ----
exports.genre = async (req, res) => {
  const { FLAG, GenreID, title } = req.body;

  try {
    if (FLAG === "I") {
      if (!title) {
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
      const genreData = new genre({
        title,
      });
      await genreData.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "U") {
      const update = { title };

      await genre.findByIdAndUpdate(GenreID, update, {
        new: true,
      });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "S") {
      const showgenre = await genre.find();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Values: showgenre.length <= 0 ? null : showgenre,
      });
    } else if (FLAG === "D") {
      await genre.findByIdAndDelete({ _id: GenreID });

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
