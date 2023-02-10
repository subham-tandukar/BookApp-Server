const express = require("express");
const router = express.Router();
const user = require("../models/userSchema");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const upload = require("../multerconfig/storageConfig");

// -------------------------------

// add user ---------------------------
router.post("/api/addUser", async (req, res) => {
  try {
    let preuser = await user.findOne({ email: req.body.email });

    if (preuser) {
      return res.status(422).json({
        Message: "This email already exist",
      });
    }

    // const file = req.file.filename;

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    const adduser = new user({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    await adduser.save();
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
});

// get user ---------------------------
router.get("/api/getUserData", async (req, res) => {
  try {
    const userdata = await user.find();
    res.status(201).json({
      UserData: userdata.length <= 0 ? null : userdata,
      StatusCode: 200,
      Message: "success",
    });
    console.log("userdata", userdata);
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// get individual user ---------------------------
router.get("/getUser/:id", async (req, res) => {
  try {
    console.log("userdata", req.params);
    const { id } = req.params;

    const userIndividual = await user.findById({ _id: id });
    console.log("userIndividual", userIndividual);
    res.status(201).json({
      UserList: [userIndividual],
      StatusCode: 200,
      Message: "success",
    });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// update user ---------------------------
router.patch("/updateUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await user.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("updated User", updatedUser);
    res.status(201).json({ StatusCode: 200, Message: "success" });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// delete user ---------------------------
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUser = await user.findByIdAndDelete({ _id: id });

    console.log("updated User", deleteUser);
    res.status(201).json({ StatusCode: 200, Message: "success" });
  } catch (error) {
    res.status(422).json({
      StatusCode: 400,
      Message: error,
    });
  }
});

// ---------------------------

// login

router.post("/api/login", (req, res, next) => {
  user
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(422).json({
          message: "User doesn't exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(422).json({
            message: "Password doesn't match",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              name: user[0].name,
              email: user[0].email,
            },
            "this is dummy text",
            {
              expiresIn: "24h",
            }
          );
          res.status(201).json({
            name: user[0].name,
            email: user[0].email,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(422).json({
        message: err,
      });
    });
});

module.exports = router;
