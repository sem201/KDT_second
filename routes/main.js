const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

router.get("/", controller.login);
router.get("/signup", controller.signup);

// router.get("/", controller.index);

router.get("/home", controller.index);

router.post("/home/post", controller.index_POST);

module.exports = router;
