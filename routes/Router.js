const express = require("express");
const router = express.Router();
const controller = require("../controller/Cuser");

router.get("/", controller.index);

router.get("/reunion", controller.reunion_GET); //모임 사이토 진입 - 완료

router.post("/reunion", controller.reunion_POST); //모임 정보 추가 - 완료

router.patch("/reunion", controller.Moim_UPDATE); //모임 정보 업데이트 - 완료

router.delete("/reunion", controller.Moim_destory); //모임 정보 삭제, 모임 detail 테이블은 casecade 규칙에 따라 삭제 됨 - 완료

router.post("/reuniondetail", controller.MoimDetail_POST); // 모임 정보 테이블에 추가가 이뤄지면 모임 detail테이블의 정보 추가가 이뤄짐 - 완료

router.patch("/reuniondetail", controller.moim_detail_UPDATE);
// 모임 정보 테이블에 정보 업데이트가 추가 되면 업데이트 수행, 업데이트 실패 시 모임 테이블의 정보를 원래대로 되돌리는 로직 필요 - 완료

router.post("/moimset", controller.MoimSet_POST); // 모임에 가입함.

router.patch("/moimset", controller.Moimset_patch); //가입한 사용자의 별점을 수정함

router.delete("/moimset", controller.MoimSet_detory); // 모임 set 테이블의 정보를 삭제함.

module.exports = router;
