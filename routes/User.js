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

// 프로필 페이지 렌더링
router.get("/profile", userController.userInformation);

// 회원정보 확인
router.post("/check-pw", userController.userPasswordConfirm);

// 회원정보 업데이트
router.patch("/update", userController.updateUser);

// 회원정보 삭제
router.delete("/delete", userController.userDelete);

// user가 상세 모임에서 찜하기
router.post("/dibs/:moimid", userController.dibsMoim);

// 리뷰 테스트
router.get("/review", userController.review);

// 모집글 테스트
router.get("/meeting", userController.meeting);

router.get("/info", userController.userInformation);

// 회원정보 수정 페이지 렌더링
router.get("/editprofile", userController.editProfilePage);

//user 리뷰 페이지 렌더링
router.get("/review", userController.review);

// user에 대한 리뷰
router.post("/review", userController.postReview);

// user 로그아웃
router.get("/logout", userController.logout);

// user가 참여중인 모임 가져오기
router.get("/participating", userController.participatingMoim);

// user가 참여한 모임 가져오기
router.get("/participated", userController.participatedMoim);

module.exports = router;
