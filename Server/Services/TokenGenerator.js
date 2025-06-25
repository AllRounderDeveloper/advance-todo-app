const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateTokens = (user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "5d",
  });
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

module.exports = generateTokens;