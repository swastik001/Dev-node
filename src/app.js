const express = require("express");
const connectDB = require("./config/database");
const app = express();
const bcrypt = require("bcrypt");

const User = require("./models/user");
const { isAuth } = require("./middleware/adminAuth");
const { validateSignUp } = require("./utils/validation");

app.use(express.json()); //this is a middleware, it will parse the incoming request body to json, so that we can access it in req.body. This is a built-in middleware in express. Now as we know   app.use will be executed for every incoming request, this is same like app.use((req, res, next) => {})

//post
app.post("/signup", async (req, res) => {
  // const user = new User(req.body);
  const { firstName, lastName, emailId, password, age, gender } = req?.body;

  //valide signup feilds
  validateSignUp(req);

  //encrypt the password
  const passwordHash = await bcrypt.hash(password, 10); // it takes 2 arguments, first is the password to be hashed, second is the salt rounds, which is the number of times the password will be hashed
  console.log("passwordHash", passwordHash);
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

//get user by emailID
app.get("/user", async (req, res) => {
  const userEmail = req.body?.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    // FIND RETURNS ARRAY
    if (users.length === 0) {
      res.send("no users found");
    } else {
      res.send(users);
    }
  } catch (e) {
    res.status(400).send("Something went wrong" + e.message);
  }
});

//Login User
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId: emailId });
    // console.log("ooo", user);
    if (!user) {
      throw new Error("Invalid Credentials, user not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (e) {
    res.send(" Login Failed - " + e.message);
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
app.patch("/user/:userId", async (req, res) => {
  const id = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];
    const isUpdateAloowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAloowed) {
      throw new Error("Update not allowed");
    }
    if (data.skills.length > 6) {
      throw new Error("Skills should be less than 6");
    }
    await User.findByIdAndUpdate({ _id: id }, data, {
      returnDocument: "before",
      runValidators: true,
    }); // we passed whole data object, so it will update all the fields in the data object, but it will ignore the fields which are not present in the data object, so it will not delete any field, it will only update the fields which are present in the data object.
    //returnDocument: "before" will return the document before update, if we want to return the document after update, we can use returnDocument: "after". default is "before"
    //  runValidators: true, this will make sure that the validators are run on the updated data,

    res.send("User Updated");
  } catch (e) {
    res.send("Something went wrong, Again!" + e.message);
  }
});

connectDB()
  .then(async () => {
    // first connect to db, then start (listening ) to server
    console.log("Cluster connection established");
    app.listen(7777, () => {
      console.log("server is up");
    });
  })
  .catch((e) => {
    console.log("Cluster cannot be connected", e.message);
  });
