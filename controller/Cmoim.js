const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
} = require("../models/index");

exports.Moims_GET = async (req, res) => {
  try {
    const data = await Moim.findAll();
    
    res.render("moim_list", {data: data});
  } catch(error){
    res.json({ result: true, Message: "모임 정보 불러오기에 실패하였습니다!!!" });
  }
};

exports.Moim_destory = async (req, res) => {
  const { user_id, moim_id } = req.body;
  try {
    await Moim.destroy({
      where: { user_id, moim_id },
    });
    res.json({ result: true });
  } catch (error) {
    res.json({ result: true, Message: "모임 정보 삭제에 실패하였습니다!!!" });
  }
};

exports.moim_insert = (req, res) => {
  res.render("moiminsert"); // 모임 추가 창으로 가는 코드
};

exports.Moimset_patch = async (req, res) => {
  //각 유저 별 모임 점수 수정
  // if (req.session.userInfo) {
  try {
    const { moim_id, user_id, updatereview } = req.body;
    await MoimSet.update(
      { user_review: updatereview },
      { where: { user_id, moim_id } }
    );
    res.send({
      result: true,
      Message: `해당 user의 점수를 ${updatereview}로 수정합니다`,
    });
  } catch (error) {
    res.send({
      result: false,
      Message: "에러 발생!! 유저의 별점을 설정할 수 없습니다.",
    });
  }
  // } else {
  //   res.redirect("/login");
  // }
};
exports.MoimSet_detory = async (req, res) => {
  // if (req.session.userInfo) {
  try {
    const { user_review, moim_id, user_id } = req.body;
    await MoimSet.destroy({ where: { moim_id, user_id } });
    res.json({ result: true, Message: "모임 가입을 취소하였습니다." });
  } catch (error) {
    res.send({
      result: false,
      Message: "에러 발생!! 모임 가입을 해제할 수 없습니다.",
    });
  }
  // } else {
  //   res.redirect("/login");
  // }
};

exports.MoimSet_POST = async (req, res) => {
  // if (req.session.userInfo) {
  try {
    const { user_review, moim_id, user_id } = req.body;
    MoimSet.create({ moim_id, user_id });
    res.send({
      result: true,
      Message: "모임에 가입해주신 것을 환영합니다.",
    });
  } catch (error) {
    res.send({
      result: false,
      Message: "에러 발생!! 모임에 가입할 수 없습니다.",
    });
  }
  // } else {
  //   req.redirect("/login");
  // }
};

exports.moim_detail_UPDATE = async (req, res) => {
  try {
    const { moim_id, content, min_people } = req.body;
    await MoimDetail.update({ content, min_people }, { where: { moim_id } });
    res.send({
      result: true,
      Message: "moim 정보 업데이트에 성공하셨습니다.",
    });
  } catch (error) {}
};

exports.Moim_UPDATE = async (req, res) => {
  // if (req.session.userInfo) {
  const {
    title,
    on_line,
    max_people,
    expiration_date,
    even_date,
    location,
    represent_img,
    user_id,
    moim_id,
  } = req.body;
  await Moim.update(
    {
      title,
      on_line,
      max_people,
      expiration_date,
      even_date,
      location,
      represent_img,
      user_id,
    },
    { where: { moim_id } }
  );
  res.send({
    result: true,
    Message: "moim 정보 업데이트 1단계에 성공하셨습니다.",
  });
  // } else {
  //   res.redirect("/login");
  // }
};

exports.MoimDetail_POST = async (req, res) => {
  // if (req.session.userInfo) {
  const { moim_id, content, min_people } = req.body;
  try {
    await MoimDetail.create({ moim_id, content, min_people });
    res.json({ result: true });
  } catch (error) {
    console.error(error);
    await Moim.destroy({ where: { moim_id } });
    //Moim_detaill 테이블에 정보 저장이 실패하였을 때, Moim table의 이전 저장 정보를 삭제한다.
    res.send({ result: false, Message: "모임 개설에 실패하였습니다." });
  }
  // } else {
  //   res.redirect("/login");
  // }
};

exports.Moims_POST = async (req, res) => {
  // if (req.session.userInfo) {
  try {
    const {
      title,
      on_line,
      max_people,
      expiration_date,
      even_date,
      location,
      represent_img,
      user_id,
    } = req.body;

    console.log(req.body);
    const date = await Moim.create({
      title,
      on_line,
      max_people,
      expiration_date,
      even_date,
      location,
      represent_img,
      user_id,
    });
    res.json({ result: true, userInfo: date });
  } catch (error) {
    console.error(error);
    res.send({
      result: false,
      Message: "모임 개설에 실패하였습니다.",
      userInfo: null,
    });
  }
  // } else {
  //   res.redirect("/login");
  // }
};

// 모임 디테일 페이지 렌더링
exports.MoimDetail_render = async (req, res) => {
  console.log(req.params.moimid);
  try {
    const data = await Moim.findOne({where: {moim_id: req.params.moimid}});
    // const detail = await MoimDetail.findOne({where: {moim_id: req.params.moim_id}})
    res.render("moim_detail", {data});
  } catch(error){
    res.json({ result: true, Message: "모임 정보 불러오기에 실패하였습니다!!!" });
  }
};

exports.moimlist1 = async (req, res) => {
  const data = await Moim.findAll();
  if (data) {
    res.json("moimlist", { data });
  } else {
    alert("모임 리스트 출력 실패");
    res.redirect("/");
  }
};
