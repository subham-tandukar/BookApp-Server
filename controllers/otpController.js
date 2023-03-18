const User = require("../models/userSchema");
const nodeMailer = require("nodemailer");

// --- otp ---
exports.otp = async (req, res) => {
  const { OTP, Email } = req.body;
  try {
    let user = await User.findOne({ Email });

    if (!user) {
      return res.status(422).json({
        Message: "Email doesn't exist",
      });
    }

    if (OTP !== user.OTP) {
      return res.status(422).json({
        Message: "Invalid OTP",
      });
    }

    const update = { Status: "Verified" };
    const options = { new: true }; // Return the updated document

    await User.findOneAndUpdate({ Email }, update, options);

    res.status(201).json({
      StatusCode: 200,
      Message: "success",
      Status: "Verified",
    });
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: "OTP already used",
    });
  }
};

// --- otp ---
exports.resendOtp = async (req, res) => {
  const { Email } = req.body;
  try {
    const presuer = await User.findOne({ Email: Email });
    if (presuer) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      const updateData = await User.findOneAndUpdate(
        { Email },
        {
          OTP: otp,
        },
        { new: true }
      );
      await updateData.save();

      const update = { Status: "Unverified" };
      const options = { new: true }; // Return the updated document

      await User.findOneAndUpdate({ Email }, update, options);

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
          });
        }
      });
    } else {
      return res.status(422).json({
        Message: "User doesn't exist",
      });
    }
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: "OTP already used",
    });
  }
};
