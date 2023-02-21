const express = require("express");
const router = new express.Router();
const User = require("../models/userSchema");

const controllers = require("../controllers/booksController");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Subhamisa@Boy";


// ==========
router.post("/api/book", controllers.bookpost);
// -------------------------------

// add user ---------------------------
router.post("/api/addUser", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(422).json({
        Message: "This email already exist",
      });
    }

    // const file = req.file.filename;

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
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
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// get user ---------------------------
router.get("/api/getUserData", async (req, res) => {
  try {
    const userdata = await User.find();
    res.status(201).json({
      UserData: userdata.length <= 0 ? "No data" : userdata,
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
});

// ---------------------------

// login

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist",
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({
        message: "Password doesn't match",
      });
    }

    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.status(201).json({
      Login: [
        {
          Name: user.name,
          Email: user.email,
          UserID: user._id,
        },
      ],
      Token: authToken,
      StatusCode: 200,
      Message: "success",
    });
  } catch (err) {
    res.status(401).json({
      StatusCode: 400,
      Message: err,
    });
  }
});

module.exports = router;
