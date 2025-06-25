const { theme } = require("../Services/Index");

exports.getTheme = async (req, res) => {
  try {
    const { token } = req.headers;

    const currentTheme = await theme.getTheme(token);

    res.status(201).json(currentTheme);
  } catch (e) {
    res.status(201).json({ theme: "light" });
  }
};

exports.setTheme = async (req, res) => {
  try {
    const { token } = req.headers;

    const setThemeStatus = await theme.setTheme(token);

    res.status(200).json(setThemeStatus);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e });
  }
};
