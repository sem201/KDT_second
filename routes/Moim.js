const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmoim");

router.get("/moims", controller.MoimList_GET); //모임 사이트 진입

router.get("/moims/get", controller.Moims_GET); //모임 정보 불러오기

router.post("/moims", controller.Moims_POST); //모임 정보 추가 - 완료

router.get("/moims/:location", controller.moimlistSelect); //모임 table에서 지역 별로 정보를 가져오기 위한 코드

router.patch("/moimsdetail", controller.moim_detail_UPDATE);

router.post("/moimsdetail", controller.MoimDetail_POST); // 모임 정보 테이블에 추가가 이뤄지면 모임 detail테이블의 정보 추가가 이뤄짐 - 완료

router.patch("/moims", controller.Moim_UPDATE); //모임 정보 업데이트 - 완료

// 모임 정보 테이블에 정보 업데이트가 추가 되면 업데이트 수행, 업데이트 실패 시 모임 테이블의 정보를 원래대로 되돌리는 로직 필요 - 완료

router.post("/moimset", controller.MoimSet_POST); // 모임에 가입함.

router.patch("/moimset", controller.Moimset_patch); //가입한 사용자의 별점을 수정함

router.delete("/moimset", controller.MoimSet_detory); // 모임 set 테이블의 정보를 삭제함.
router.delete("/moims", controller.Moim_destory); //모임 정보 삭제, 모임 detail 테이블은 casecade 규칙에 따라 삭제 됨 - 완료

// 상세 모임 화며 조회
router.get("/moim_detail/:moimid", controller.MoimDetail_render);

router.get("/moimlist/:moimid", controller.Moimlist_GET);

router.get("/moim_insert", controller.moim_insert);

router.get("/moim_list", controller.moimlist); // moimlist 페이지 이동

module.exports = router;
