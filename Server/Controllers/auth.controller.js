const { auth } = require("../Services/Index");

exports.SignUp = async (req, res) => {
  try {
    const userData = { ...req.body };
    const userSignUp = await auth.signUp(userData);

    res.status(200).json(userSignUp);
  } catch (err) {
    console.group(err);
    res.status(200).json({ message: err.message, bool: false, AT: null });
  }
};

exports.SignOut = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.headers;

    const userSignOut = await auth.signOut(token, password);

    res.status(200).json(userSignOut);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e, bool: false });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userLoggedIn = await auth.login(email, password);

    res.status(202).json(userLoggedIn);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ bool: false, message: "Internal server error" });
  }
};

exports.ChangePass = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { token } = req.headers;

    const UserchangePass = await auth.changePass(
      currentPassword,
      newPassword,
      token
    );

    res.status(200).send(UserchangePass);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e, bool: false });
  }
};

exports.User = async (req, res) => {
  try {
    const { token } = req.headers;

    const user = await auth.getUser(token);

    res.status(201).json({ user: user });
  } catch (e) {
    console.log(e);
    res.status(400).json({ user: e });
  }
};
