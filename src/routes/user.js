const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "gender",
  "about",
  "skills",
];

//get all pending connection request for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA); //this will populate the fromUserId field with the firstName and lastName of the user who sent the request,

    //we can alsopolulate using("fromUserId","firstName lastName emailId")

    res.json({
      message: "requests fetched",
      requests: requests,
    });
  } catch (e) {
    res.status(400).send("Error " + e.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA); //but we dont need to populate toUserId/FROMUSERID because we are only interested in the users who sent the request to the logged in user, and not the users who received the request from the logged in user.

    const data = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.json({
      message: "connections fetched",
      connections: data,
    });
  } catch (e) {
    res.status(400).send("Error " + e.message);
  }
});

module.exports = { userRouter };
