const router = require("express").Router();
const Authentication = require("./v1/authentication.route");
const themeRoute = require("./v1/theme.route");
const TodoRoutes = require("./v1/todo.route");

router.use("/api", Authentication);
router.use("/theme", themeRoute);
router.use("/todo", TodoRoutes);

module.exports = router;
