const exxpress = require("express");

const app = exxpress();

// request handler
app.use("/test", (req, res) => {
  res.send("hello from server");
});

app.listen(3000, () => {
  console.log("sir-war");
});
