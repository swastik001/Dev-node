const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const toUser = await User.findById({ _id: toUserId });
      const status = req.params.status;
      const allowedStatuses = ["ignored", "interested"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Allowed statuses are: ${allowedStatuses.join(", ")}`,
        });
      }

      //check user exists or not
      const existingUser = await User.findById(toUserId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if a connection request already exists
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ], //this will check if there is already a connection request between the two users, either from the sender to the receiver or vice versa. $or is database operator.
      });
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      // we wil also check if to user Id and from user Id are same, we are doing it at schema level with pre

      const cr = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });
      await cr.save();

      res.json({
        message: `${req.user.firstName} ${status} ${toUser.firstName}`,
      });
    } catch (e) {
      res.status(400).send("Error " + e.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { requestId, status } = req.params;
      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status.`,
        });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({
        message: `Connection request ${status} successfully`,
      });
    } catch (e) {
      res.status(400).send("Error " + e.message);
    }
  },
);

module.exports = { requestRouter };
