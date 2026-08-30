const { mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const validator = require("validator");
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true, //now this field is required, if we try to save a user without firstName, it will throw an error
      minlength: 3, //this will make sure that the firstName is at least 3 characters long,
      maxlength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, //this will make sure that no two users can have the same emailId, if we try to save a user with an emailId that already exists, it will throw an error
      // when we make unique true, it will create index automaticaly.
      // wee can also create idex by doing index:true

      lowercase: true, //this will make sure that the emailId is always stored in lowercase,
      trim: true, //this will make sure that there are no spaces before or after the emailId,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address - " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong Password - " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18, //this will make sure that the age is at least 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value.toLowerCase())) {
          throw new Error("Invalid gender");
        } //  by defaault, validate function is only called when we are adding a new user, but. we can also use it when we are updating a user, by using the option { runValidators: true } in the update function, so that it will validate
      },
    },

    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid profile Url - " + value);
        }
      },
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrs6Y-6VAaqH0AIqss-FEL6zHbOnETo9E_Ulrn05C0DA&s=10", //default image URL if user does not provide photoUrl
    },
    about: {
      type: String,
      default: "Hey there! I am using DevTinder",
    },
    skills: {
      type: [String], //array of strings
      //mongodb will automatically create an empty array of strings,
    },
  },

  { timestamps: true }, //this will automatically add createdAt and updatedAt fields to the user document, so that we can know when the user was created and when it was last updated
);

//this is how you create a model, first argument is name second is Schema.
//also U in caps in user, nomenclature for telling its a mongoose-model

//schema Methods- these are the methods that we can use on the user model, like we can use user.getJWT() to get the JWT token for the user, or user.validatePassword() to validate the password of the user, these methods are defined in the schema, and we can use them on the user model.

userSchema.methods.getJWT = async function () {
  const user = this;
  const jwtToken = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return jwtToken;
};
userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const savedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(inputPassword, savedPassword);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
