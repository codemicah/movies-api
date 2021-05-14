const router = require("express").Router();
const registerController = require("../controllers/register.controller");

router.post("/register", registerController.register);

module.exports = router;
