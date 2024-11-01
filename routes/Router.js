const express = require("express");
const router = express.Router();
const controller = require("../controller/Cuser");

router.get("/", controller.index);

module.exports = router;
