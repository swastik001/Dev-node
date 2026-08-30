const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const cookies = req.cookies;
  const { token } = cookies;
  if (!token) {
    return res.status(401).send("Please login");
  }
  try {
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
};
module.exports = { userAuth };
