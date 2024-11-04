const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
<<<<<<< HEAD
router.get("/login", controller.login);
router.get("/signup", controller.signup);
=======

router.get("/", controller.index);

router.get("/login", controller.login);
>>>>>>> 1fb6a3380d99bcf76bcc7e8b9f5a90c46a7c7900

module.exports = router;
