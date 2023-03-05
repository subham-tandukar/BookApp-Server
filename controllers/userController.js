const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Subhamisa@Boy";

// --- user ---
exports.user = async (req, res) => {
  const { Name, Email, Password, FLAG } = req.body;
  try {
    if (FLAG === "I") {
      let user = await User.findOne({ Email: Email });

      if (user) {
        return res.status(422).json({
          Message: "This email already exist",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(Password, salt);

      user = await User.create({
        Name: Name,
        Email: Email,
        Password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.status(201).json({
        authToken,
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "S") {
      const userdata = await User.find();
      res.status(201).json({
        Values: userdata.length <= 0 ? "No data" : userdata,
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

// --- get new user ---
exports.getNewUser = async (req, res) => {
  try {
    const limit = 5;
    const userdata = await User.find().limit(limit).sort({ createdAt: -1 });
    res.status(201).json({
      Values: userdata.length <= 0 ? "No data" : userdata,
      StatusCode: 200,
      Message: "success",
    });
    console.log("userdata", userdata);
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: error,
    });
  }
};
