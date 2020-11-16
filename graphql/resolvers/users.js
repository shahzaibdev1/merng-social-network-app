const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../utils/Validators");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

const comparePassword = (password, user, errors) => {
  return bcrypt.compare(password, user.password).then((isMatch) => {
    if (!isMatch) {
      errors.general = "Wrong credentials";
      throw new UserInputError("Wrong credentials", {
        errors: {
          general: "Wrong credentials",
        },
      });
    }

    const token = generateToken(user);

    return {
      ...user._doc,
      id: user._id,
      token,
    };
  });
};

module.exports = {
  Mutation: {
    login(_, { username, password }, context, info) {
      let { errors, isValid } = validateLoginInput(username, password);

      if (!isValid) {
        throw new UserInputError("Errors in input", { errors });
      }

      // Find user by username
      return User.findOne({ username }).then((user) => {
        if (!user) {
          return User.findOne({ email: username }).then((user) => {
            if (!user) {
              errors.general = "Wrong credentials";
              throw new UserInputError("Wrong credentials", {
                errors: {
                  username: "Wrong credentials",
                },
              });
            }
            return comparePassword(password, user, errors);
          });
        } else {
          return comparePassword(password, user, errors);
        }
      });
    },

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

        const token = generateToken(res);

        return {
          ...res._doc,
          id: res._id,
          token,
        };
      }
    },
  },
};
