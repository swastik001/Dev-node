const validator = require("validator");

const validateSignUp = (req) => {
  //most of the validation is already done in the model, but we can also do it here.So we can do some basic validation here, and then let the model do the rest of the validation. This way we can send a better error message to the user.
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  }
  if (firstName.length < 3 || firstName.length > 30) {
    throw new Error("First name must be between 3 and 30 characters");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address - " + emailId);
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong Password - " + password);
  }
};

const validateEditProfile = (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_UPDATES.includes(field),
  );
  return isEditAllowed;
};
module.exports = { validateSignUp, validateEditProfile };
