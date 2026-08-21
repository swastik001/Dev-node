const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const { validateEditProfile } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (e) {
    res.status(400).send("Something went wrong, Again!" + e.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Update not allowed");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save(); //this will save the updated user data to the database

    res.json({
      message: `${loggedInUser.firstName}, Profile Updated Successfully"`,
      data: loggedInUser,
    });
  } catch (e) {
    res.status(400).send("Error!" + e.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const newPassword = req.body.password;
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Enter a strong Password");
    }
    //sabse pehle user find krna hai db se-> ho chuka, userAuth ne dediya
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash;

    await loggedInUser.save();
    res.send("Password Updated Successfully");
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = { profileRouter };
