const mongoose = require("mongoose");

const connectDB = async () => {
  //returns a promise to better to  use async-await
  await mongoose.connect(
    process.env.DB_CONNECTION_STRING, //yeh jo last me /devTinder hai, yeh hamne add kiya right? cluster string ke aage "/" krke hum nya bd bna diye cluster ke andar
  );
};
module.exports = connectDB;
