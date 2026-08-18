const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { isAuth } = require("./middleware/adminAuth");
const app = express();

app.use(express.json()); //this is a middleware, it will parse the incoming request body to json, so that we can access it in req.body. This is a built-in middleware in express. Now as we know   app.use will be executed for every incoming request, this is same like app.use((req, res, next) => {})

//post
app.post("/signup", async (req, res) => {
  // console.log(req.body);

  const user = new User(req.body);
  try {
    await user.save();
  } catch (e) {
    res.status(400).send("something went wrong");
  }
  res.send("User signed up successfully");
});

//get user by emailID
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    // FIND RETURNS ARRAY
    if (users.length === 0) {
      res.send("no users found");
    } else {
      res.send(users);
    }
  } catch (e) {
    res.status(400).send("Something went wrong");
  }
});

//get all users for feed
app.get("/feed", async (req, res) => {
  //epmty {} will return all users
  const allUsers = await User.find({});
  try {
    res.send(allUsers);
  } catch (e) {
    res.send("Something went wrong, Again!");
  }
});

//find by ID and delete
app.delete("/user", async (req, res) => {
  const id = req.body.userId;
  try {
    // we can also do { _id: id }, or just by passing value of _id as shown
    await User.findByIdAndDelete(id);
    res.send("User Deleted");
  } catch (e) {
    res.send("Something went wrong, Again!");
  }
});

//Patch data of user
app.patch("/user", async (req, res) => {
  const id = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate({ _id: id }, data, {
      returnDocument: "before",
    }); // we passed whole data object, so it will update all the fields in the data object, but it will ignore the fields which are not present in the data object, so it will not delete any field, it will only update the fields which are present in the data object.
    //returnDocument: "before" will return the document before update, if we want to return the document after update, we can use returnDocument: "after". default is "before"

    res.send("User Updated");
  } catch (e) {
    res.send("Something went wrong, Again!");
  }
});

connectDB()
  .then(() => {
    // first connect to db, then start (listening ) to server
    console.log("Cluster connection established");
    app.listen(7777, () => {
      console.log("server is up");
    });
  })
  .catch(() => {
    console.log("Cluster cannot be connected");
  });
