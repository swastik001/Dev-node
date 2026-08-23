const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId, // this type of id given by mongodb,
    required: true,
    // index: true, //this will make fromuserId indexed and make queries faster
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // index: true, //this will make touserId indexed and make queries faster
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status `,
    }, // this will make sure that the status is one of the values in the enum, if we try to save a connectionRequest with a status that is not in the enum, it will throw an error
    required: true,
  },
});

//compoumd Indexing-this will make queries faster when we requere both to and from
//1 is accending order, -1 is descending order,
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  }
}); // this is pre-save, will be called before saving the connectionRequest,
//we could have checked this at api-level also

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
