const User = require("../models/userSchema");
const appUser = require("../models/appUserSchema");
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
      if (!Name || !Email || !Password || !Profile) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
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
          name: user.Name,
          email: user.Email,
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
            StatusCode: 200,
            Message: "success",
            OTP: otp,
            authToken,
            Status: user.Status,
          });
        }
      });
    } else if (FLAG === "S") {
      const userdata = await User.find({ Status: "Verified" });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Values: userdata.length <= 0 ? "No data" : userdata,
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
    const userdata = await User.find({ Status: "Verified" })
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(201).json({
      StatusCode: 200,
      Message: "success",
      Values: userdata.length <= 0 ? "No data" : userdata,
    });
    console.log("userdata", userdata);
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: error,
    });
  }
};

// --- app user ---
exports.appUser = async (req, res) => {
  const { Name, Email, Password, FLAG, Profile, UserID } = req.body;
  try {
    if (FLAG === "I") {
      if (!Name || !Email || !Password || !Profile) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      let user = await appUser.findOne({ Email: Email });

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
        folder: "appProfile",
      });

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(Password, salt);

      user = await appUser.create({
        Profile: {
          public_id: profileImg.public_id,
          url: profileImg.secure_url,
        },
        Name: Name,
        Email: Email,
        Password: secPass,
      });

      const data = {
        user: {
          id: user.id,
          name: user.Name,
          email: user.Email,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        authToken,
      });
    } else if (FLAG === "S") {
      const userdata = await appUser.find();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Values: userdata.length <= 0 ? "No data" : userdata,
      });
    } else if (FLAG === "V") {
      const showuser = await appUser.findById({ _id: UserID });
      if (showuser) {
        res.status(201).json({
          StatusCode: 200,
          Message: "success",
          Values: [showuser],
        });
      } else {
        res.status(401).json({
          StatusCode: 400,
          Message: "User not found",
        });
      }
    } else if (FLAG === "U") {
      if (!Name || !Profile) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      let urlRegex =
        /^(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&amp;:/~+#-]*$/;

      // Check if the URL matches the regex pattern
      const changeImage = urlRegex.test(Profile);

      let userImage;

      if (!changeImage) {
        const updateUser = await appUser.findById({ _id: UserID });

        await cloudinary.uploader.destroy(updateUser.Profile.public_id);

        userImage = await cloudinary.uploader.upload(Profile, {
          folder: "appProfile",
        });
      }

      let update;

      if (changeImage === false) {
        update = {
          Name,
          Profile: {
            public_id: userImage.public_id,
            url: userImage.secure_url,
          },
        };
      } else {
        update = {
          Name,
        };
      }

      await appUser.findByIdAndUpdate(UserID, update, {
        new: true,
      });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "D") {
      const deleteUser = await appUser.findByIdAndDelete({ _id: UserID });

      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(deleteUser.Profile.public_id);

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

// --- get new app user ---
exports.getUser = async (req, res) => {
  try {
    // const limit = 5;
    const userdata = await appUser
      .find()
      .limit(req.limit)
      .sort({ createdAt: -1 });
    res.status(201).json({
      StatusCode: 200,
      Message: "success",
      Values: userdata.length <= 0 ? "No data" : userdata,
    });
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: error,
    });
  }
};
