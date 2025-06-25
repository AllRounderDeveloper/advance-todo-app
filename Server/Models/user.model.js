const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Users Schema
const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  token: String,
  theme: String,
  blocked: Boolean,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();

  if (update && update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const userModel = new mongoose.model("users", userSchema);

module.exports = { userModel };
