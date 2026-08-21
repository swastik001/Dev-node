const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUp } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req?.body;

  validateSignUp(req);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
    age,
    gender,
  });
  try {
    await user.save();
  } catch (e) {
    res.status(400).send("Sign Up Failed", +e.message);
  }
  res.send("User signed up successfully");
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials, user not found");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const jwtToken = await user.getJWT();

      res.cookie("token", jwtToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      });

      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (e) {
    res.send(" Login Failed - " + e.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()), //here we are setting the cookie to null and expiring it immediately, so that the token is removed from the browser.
    })
    .send("Logged out successfully"); //we can chain the res.cookie() and res.send() methods, its same as writing it as res.cookie(); res.send("Logged out");
});

module.exports = { authRouter };
