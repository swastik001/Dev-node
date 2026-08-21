const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const cookies = req.cookies;
  const { token } = cookies;
  if (!token) {
    throw new Error("Token not found");
  }
  try {
    const decodedObj = await jwt.verify(token, "SECRETOKENKEY");
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
