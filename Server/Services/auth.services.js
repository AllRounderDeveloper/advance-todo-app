require("dotenv").config();
const generateTokens = require("./TokenGenerator");
const { Todos, User } = require("../Models/Index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (userData) => {
  const userQuery = await User.userModel.findOne({ email: userData.email });

  if (userQuery !== null) {
    return {
      message: "User already exists with this email",
      bool: false,
      AT: null,
    };
  }

  const newUser = await User.userModel.create(userData);

  const tokens = generateTokens(newUser);
  newUser.token = tokens.refreshToken;
  newUser.save();

  return {
    message: "Signup sucessfull",
    bool: true,
    AT: tokens.accessToken,
  };
};

exports.login = async (email, password) => {
  const user = await User.userModel.findOne({ email });
  if (!user) {
    return { bool: false, message: "User not Exist", token: null };
  }

  const dataPass = user.password;
  const isMatch = await bcrypt.compare(password, dataPass);

  if (!isMatch) {
    return { bool: false, message: "Invalid Password", token: null };
  }

  const tokens = generateTokens(user);

  return {
    bool: true,
    token: tokens.accessToken,
    message: "Login successful",
  };
};

exports.signOut = async (token, password) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
  const data = await User.userModel.findOne({ _id: payload.userId });

  const databasePass = data?.password;
  const passwordMatch = await bcrypt.compare(password, databasePass);

  if (!passwordMatch) {
    return { message: "Invalid Password", bool: false };
  }

  await User.userModel.deleteMany({ _id: payload.userId });
  await Todos.TodoModel.deleteMany({ token: token });
  return { mesage: "Account Deleted", bool: true };
};

exports.changePass = async (currentPassword, newPassword, token) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
  const user = await User.userModel.findOne({ _id: payload.userId });

  const passMatch = await bcrypt.compare(currentPassword, user.password);

  if (!passMatch) return { message: "Invalid Password", bool: false };

  await User.userModel.updateOne(
    { _id: payload.userId },
    { password: newPassword }
  );

  return { message: "Success", bool: true };
};

exports.getUser = async (token) => {
  const payload = jwt?.verify(token, process.env.ACCESS_TOKEN);
  const user = await User.userModel.findOne({ _id: payload.userId });
  return user;
};
