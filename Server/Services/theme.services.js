require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../Models/Index");

const getTheme = async (token) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
  const data = await User.userModel.findOne({ _id: payload.userId });
  const theme = data.theme;

  return { theme };
};

const setTheme = async (token) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN);

  const data = await User.userModel.findOne({ _id: payload.userId });
  const newTheme = data.theme;

  await User.userModel.updateOne(
    { _id: payload.userId },
    { $set: { theme: newTheme === "light" ? "dark" : "light" } }
  );

  return { message: "Theme Changed" };
};

module.exports = { getTheme, setTheme };
