const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const JWT_SECRET = "Subhamisa@Boy";
const cloudinary = require("../cloudinary");

// --- user ---
exports.user = async (req, res) => {
  const { Name, Email, Password, FLAG, Profile } = req.body;
  try {
    if (FLAG === "I") {
      let user = await User.findOne({ Email: Email });

      // if (user.Status === "Unverified") {
      //   await User.findOneAndDelete({ Email });
      // }
      if (user) {
        return res.status(422).json({
          Message: "This email already exist",
        });
      }

      if (!Profile) {
        Profile =
          "https://res.cloudinary.com/de3eu0mvq/image/upload/v1678434591/profile/taztcmb8jl9pxe1yqzd3.png";
      }

      const profileImg = await cloudinary.uploader.upload(Profile, {
        folder: "profile",
      });

      const otp = Math.floor(100000 + Math.random() * 900000);

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(Password, salt);

      user = await User.create({
        Profile: {
          public_id: profileImg.public_id,
          url: profileImg.secure_url,
        },
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

      // email config
      let transporter = await nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: "HTDRL Email Verification",
        // text: `OTP: ${otp}`,
        html: `<html>
           <head>
             <style>
               .verification-code {
                 font-weight: bold;
                 color: #6561a1;
               }
               .text-center{
                text-align: center;
               }
               .dark{
                color: #000;
               }
               .mb-0{
                margin-bottom: 0;
               }
               .mt-3{
                margin-top: 1rem;
               }
               .mt-5{
                margin-top: 0.5rem;
               }
               .copy{
                border: 1px solid #dfdfdf;
                cursor: pointer;
                padding:0.5rem;
               }
             </style>
           </head>
           <body>
             <h3 class="dark"><strong>Verify your email address</strong></h3>
             <p class="dark">Hello ${Email},</p>
             <span class="dark">Thanks for signing up. We want to make sure it's really you. Please enter the following verification code given below. If you don't want to create an account, you can ignore this message.</span>
             <h3 class="text-center mb-0 mt-3 dark"><strong>Verification Code</strong></h3>
             <h1 class="verification-code text-center mt-5"><strong>${otp}</strong></h1>
           </body>
         </html>`,
      };
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(401).json({
            StatusCode: 400,
            Message: "Email not send",
          });
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
