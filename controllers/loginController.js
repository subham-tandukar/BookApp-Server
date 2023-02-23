const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Subhamisa@Boy";

// --- login ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        Message: "User doesn't exist",
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({
        Message: "Password doesn't match",
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
};
