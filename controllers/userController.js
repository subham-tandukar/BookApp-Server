const User = require("../models/userSchema");
const Otp = require("../models/otpSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const JWT_SECRET = "Subhamisa@Boy";

// email config
const tarnsporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

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

      const otp = Math.floor(100000 + Math.random() * 900000);

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(Password, salt);

      user = await User.create({
        Name: Name,
        Email: Email,
        Password: secPass,
      });

      const update = { OTP: otp };
      const options = { new: true }; // Return the updated document

      await User.findOneAndUpdate({ Email }, update, options);

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: "Sending Eamil For Otp Validation",
        text: `OTP:- ${otp}`,
      };

      tarnsporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({ error: error });
        } else {
          res.status(201).json({
            OTP: otp,
            authToken,
            Status: user.Status,
            StatusCode: 200,
            Message: "success",
          });
        }
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

// --- otp ---
exports.otp = async (req, res) => {
  const { OTP, Email } = req.body;
  try {
    let user = await User.findOne({ Email });

    if (user) {
      const otpData = new Otp({
        Email,
        OTP,
      });
      if (OTP === user.OTP) {
        const update = { Status: "Verified" };
        const options = { new: true }; // Return the updated document

        await User.findOneAndUpdate({ Email }, update, options);

        await otpData.save();
        res.status(201).json({
          Status: "Verified",
          StatusCode: 200,
          Message: "success",
        });
      } else {
        return res.status(422).json({
          Message: "Invalid OTP",
        });
      }
    } else {
      return res.status(422).json({
        Message: "Email doesn't exist",
      });
    }
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: error,
    });
  }
};
