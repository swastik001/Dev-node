const mongoose = require("mongoose");

const connectDB = async () => {
  //returns a promise to better to  use async-await
  await mongoose.connect(
    "mongodb+srv://swastikojha9_node:1681qe8ZWnQah3YS@nodejs.k3lpaha.mongodb.net/devTinder", //yeh jo last me /devTinder hai, yeh hamne add kiya right? cluster string ke aage "/" krke hum nya bd bna diye cluster ke andar
  );
};
module.exports = connectDB;
