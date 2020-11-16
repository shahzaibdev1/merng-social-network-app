module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  // Validate Username
  if (username.trim() === "") {
    errors.username = "Username shouldn't be empty";
  } else if (username.length < 4) {
    errors.username = "Username should be at least 4 characters";
  }

  if (email.trim() === "") {
    errors.email = "Email field shouldn't be empty";
  } else {
    let regExp = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regExp)) {
      errors.email = "Invalid Email";
    }
  }

  if (password === "") {
    errors.password = "password field shouldn't be empty";
  } else {
    if (password != confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    if (password.length < 6) {
      errors.password = "Password should be at least 6 characters";
    }
  }

  if (confirmPassword === "") {
    errors.confirmPassword = "confirmPassword field shouldn't be empty";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  // Validate Username
  if (username.trim() === "") {
    errors.username = "Username shouldn't be empty";
  } else if (username.length < 4) {
    errors.username = "Username should be at least 4 characters";
  }

  if (password === "") {
    errors.password = "password field shouldn't be empty";
  } else {
    if (password.length < 6) {
      errors.password = "Password should be at least 6 characters";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
