const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const { validateRegisterInput } = require("../utils/Validators");

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // TODO: Validate User Data
      let { isValid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!isValid) {
        throw new UserInputError("Errors in input", { errors });
      }
      // TODO: Make sure user doesn't already exist
      let checkMail = await User.findOne({ email });
      if (checkMail) {
        throw new UserInputError("Email Already Exists", {
          errors: {
            email: "This Email is already taken",
          },
        });
      } else {
        let checkUser = await User.findOne({ username });
        if (checkUser) {
          throw new UserInputError("User Already Exists", {
            errors: {
              username: "This Email is already taken",
            },
          });
        }
        // TODO: Hash the password and create auth token
        password = await bcrypt.hash(password, 8);

        const newUser = new User({
          email,
          username,
          password,
          createdAt: new Date().toISOString(),
        });

        const res = await newUser.save();

        const token = jwt.sign(
          {
            id: res.id,
            email: res.email,
            username: res.username,
          },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        return {
          ...res._doc,
          id: res._id,
          token,
        };
      }
    },
  },
};
