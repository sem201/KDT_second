const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

router.get("/", controller.index);

router.get("/login", controller.login);

module.exports = router;
