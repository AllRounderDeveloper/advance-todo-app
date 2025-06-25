const router = require("express").Router();
const { Theme } = require("../../Controllers/Index");

router.route("/themeswork").get(Theme.getTheme).patch(Theme.setTheme);

module.exports = router;
