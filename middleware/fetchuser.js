var jwt = require("jsonwebtoken");
const JWT_SECRET = "Subhamisa@Boy";

const fetchuser = (req, res, next) => {
  const { UserID } = req.body;

  if (!UserID) {
    res.status(401).json({
      StatusCode: 400,
      Message: "User not valid !",
    });
  }
  try {
    const data = jwt.verify(UserID, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: "User not valid !",
    });
  }
};

module.exports = fetchuser;
