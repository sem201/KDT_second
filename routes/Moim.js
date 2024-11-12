const express = require("express");
const multer = require("multer");
const path = require("path"); // 경로에 관한 내장 모듈
// multer 세부 설정

const uploadDetail = multer({
  // storage : 저장할 공간에 대한 정보
  storage: multer.diskStorage({
    // destination : 경로 설정
    destination(req, file, done) {
      // done: callback function
      // done(null, "~~") 여기서 null은 error를 의미하는 매개변수
      // 에러가 없으므로 "null" 이라고 전달하여 콜백함수를 호출
      done(null, "uploads/");
    },
    filename(req, file, done) {
      // console.log("ext", ext);
      // console.log(path.basename(file.originalname, ext));
      // done(null, path.basename(file.originalname, ext) + Date.now() + ext);

      console.log("file name > req.body", req.body);
      done(null, file.originalname);
    },
    // limits : 파일 제한 정보
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }),
});

const router = express.Router();
const controller = require("../controller/Cmoim");

router.get("/moims", controller.MoimList_GET); //모임 사이트 진입

router.post("/moims/post", controller.MoimList_POST); //모임 정보 불러오기

router.get("/moims/dibs", controller.DibsMoim); // 찜한 모임 불러오기

router.get("/moims/recommend", controller.RecommendMoim); //추천 모임 불러오기

router.post(
  "/moims",
  uploadDetail.single("represent_img"),
  controller.Moims_POST
); //모임 정보 추가 - 완료

router.get("/moims/:location", controller.moimlistSelect); //모임 table에서 지역 별로 정보를 가져오기 위한 코드

router.patch(
  "/moims",
  uploadDetail.single("represent_img"),
  controller.Moim_UPDATE
); //모임 정보 업데이트 - 완료

router.patch(
  "/moims/file",
  uploadDetail.single("represent_img"),
  controller.Moim_UPDATE_file
); //모임 정보 업데이트 - 완료

router.patch("/moimsdetail", controller.moim_detail_UPDATE);

router.post("/moimsdetail", controller.MoimDetail_POST); // 모임 정보 테이블에 추가가 이뤄지면 모임 detail테이블의 정보 추가가 이뤄짐 - 완료

// 모임 정보 테이블에 정보 업데이트가 추가 되면 업데이트 수행, 업데이트 실패 시 모임 테이블의 정보를 원래대로 되돌리는 로직 필요 - 완료

router.post("/moimset", controller.MoimSet_POST); // 모임에 가입함.

router.patch("/moimset", controller.Moimset_patch); //가입한 사용자의 별점을 수정함

router.post("/moimset/count", controller.Moimset_count);

router.delete("/moimset", controller.MoimSet_detory); // 모임 set 테이블의 정보를 삭제함.
router.delete("/moims", controller.Moim_destory); //모임 정보 삭제, 모임 detail 테이블은 casecade 규칙에 따라 삭제 됨 - 완료

// 상세 모임 화면 조회
router.get("/moim_detail/:moimid", controller.MoimDetail_render);

router.get("/moim_insert", controller.moim_insert);

router.get("/moim_list", controller.moimlist);

router.get("/moim_correction/:moimid", controller.moim_correction);

module.exports = router;
