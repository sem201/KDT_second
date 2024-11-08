const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

router.get("/login", controller.login);
router.get("/signup", controller.signup);

router.get("/home", controller.index);

module.exports = router;
