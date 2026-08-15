const exxpress = require("express");

const app = exxpress();

// app.use("/", (req, res) => {
//   res.send("----");
// });

// This will only handle get call
app.get("/user", (req, res) => {
  res.send("firstName:Swastik");
});

app.post("/user", (req, res) => {
  res.send("post request-data saved successfully");
});

app.delete("/user", (req, res) => {
  res.send("delete request-data deleted successfully");
});

//use- this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("hello from server");
});

app.listen(3000, () => {
  console.log("server is up and running on port 3000");
});
