const { mongoose } = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

//this is how you create a model, first argument is name second is Schema.
//also U in caps in user, nomenclature for telling its a mongoose-model
const User = mongoose.model("user", userSchema);

module.exports = User;
