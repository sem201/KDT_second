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

// 회원정보 확인
router.post("/user/check-pw", userController.userPasswordConfirm);

// 회원정보 업데이트
router.patch("/user/update", userController.updateUser);

// 상세 모임 화며 조회
router.get("/moim/:moimid", controller.moim);

// user가 상세 모임에서 찜하기
router.post("/user/dibs", userController.dibsMoim);
module.exports = router;
