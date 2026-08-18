const isAuth = (req, res, next) => {
  let token = "xyz";
  const isAuth = token === "xyz";
  if (!isAuth) res.status(400).send("unauthorized");
  // res.send("universal");
  else next();
};
module.exports = { isAuth };
