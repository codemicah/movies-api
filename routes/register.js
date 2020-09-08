const router = require("express").Router(),
    registerController = require("../controllers/register.controller");

router.post("/register", registerController.register);

module.exports = router;