const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

//get all pending connection request for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
        "skills",
      ]); //this will populate the fromUserId field with the firstName and lastName of the user who sent the request,

    //we can alsopolulate using("fromUserId","firstName lastName emailId")

    res.json({
      message: "requests fetched",
      requests: requests,
    });
  } catch (e) {
    res.status(400).send("Error " + e.message);
  }
});

module.exports = { userRouter };
