const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { isAuth } = require("./middleware/adminAuth");
const app = express();

app.use(express.json()); //this is a middleware, it will parse the incoming request body to json, so that we can access it in req.body. This is a built-in middleware in express. Now as we know   app.use will be executed for every incoming request, this is same like app.use((req, res, next) => {})

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
