const express = require("express");
const { isAuth } = require("../middleware/adminAuth");

const app = express();

app.use("/admin", isAuth);

app.get("/admin/details", (req, res) => {
  res.send("admin details fetched");
});
app.post("/admin/details", (req, res) => {
  res.send("admin details posted");
});

app.get("/user/details", isAuth, (req, res) => {
  res.send("user details fetched");
});

app.listen(7777, () => {
  console.log("server is up");
});
