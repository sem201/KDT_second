const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");
const userController = require("../controller/Cuser");

// 메인 화면 렌더링
router.get("/", controller.index);

// // 회원가입 화면 렌더링
// router.get("/signup", controller.signup);

// // 로그인 화면 렌더링
// router.get("/login", controller.login);

// 회원가입
router.post("/user/register", userController.postUser);

// 로그인
router.post("/user/login", userController.loginUser);

module.exports = router;
