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
router.post("/register", userController.postUser);

// 로그인
router.post("/login", userController.loginUser);

// 회원정보 확인
router.post("/check-pw", userController.userPasswordConfirm);

// 회원정보 업데이트
router.patch("/update", userController.updateUser);

// 회원정보 삭제
router.delete("/delete", userController.userDelete);
// 상세 모임 화며 조회
// router.get("/moim/:moimid", controller.moim);

// user가 상세 모임에서 찜하기
<<<<<<< HEAD
router.post("/user/dibs", userController.dibsMoim);
=======
router.post("/dibs", userController.dibsMoim);
>>>>>>> 4fd993c4298269eaba4f6b1fe714915b0f68f073

module.exports = router;
