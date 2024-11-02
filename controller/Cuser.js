const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { bcryptPassword, compareFunc } = require("../utils/encrypt");

const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
} = require("../models/index");

// User 회원가입
exports.postUser = async (req, res) => {
  try {
    const { userid, pw, nickname } = req.body;
    console.log("userid:", userid);
    const isduplicate = await User.findOne({
      where: {
        [Op.or]: [{ user_id: userid }, { nickname: nickname }],
      },
    });
    if (!isduplicate) {
      const hash = bcryptPassword(pw);
      console.log("사용자 생성됨");
      await User.create({
        user_id: userid,
        pw: hash,
        nickname: nickname,
      });
      res.send({ result: true, message: "계정이 생성되었습니다." });
    } else {
      console.log("중복 사용자 존재");
      res.send({ result: false, message: "중복된 사용자가 있습니다." });
    }
  } catch (error) {
    console.log("findOne 에러발생", error);
  }
};

// User 로그인
exports.loginUser = async (req, res) => {
  try {
    const { userid, pw } = req.body;
    const isExist = await User.findOne({
      where: { user_id: userid },
    });
    if (isExist) {
      const hashedPw = isExist.dataValues.pw;
      const isMatch = bcrypt.compareSync(pw, hashedPw);
      if (isMatch) {
        console.log("로그인 성공");
        console.log(isExist.dataValues);
        req.session.userInfo = {
          userid: isExist.dataValues.user_id,
          nickname: isExist.dataValues.nickname,
        };
        console.log("세션 생성", req.session.userInfo);
        res.send({ result: true, message: "로그인 성공" });
      } else {
        console.log("로그인 실패");
        res.send({
          result: true,
          message: "로그인 실패 아이디 혹은 비밀번호를 확인해주세요",
        });
      }
    } else {
      console.log("로그인 실패");
      res.send({
        result: true,
        message: "로그인 실패 아이디 혹은 비밀번호를 확인해주세요",
      });
    }
  } catch (error) {
    console.log("userlogin 에러 발생", error);
  }
};

// User 정보 확인
exports.userPasswordConfirm = async (req, res) => {
  console.log("user 세션 확인", req.session.userInfo);
  const { pw } = req.body;

  try {
    const userIsExist = await User.findOne({
      where: { user_id: req.session.userInfo.userid },
    });
    if (userIsExist && compareFunc(pw, userIsExist.dataValues.pw)) {
      console.log("user 정보 확인 성공");
      res.send("성공");
    } else {
      console.log("user 정보 다시 확인");
    }
  } catch (error) {
    console.log(error);
  }
};

// User 정보 수정
exports.updateUser = async (req, res) => {
  const { nickname, pw } = req.body;
  const updateData = {};
  if (nickname != null) {
    updateData.nickname = nickname;
  }
  if (pw != null) {
    updateData.pw = bcryptPassword(pw);
  }
  try {
    await User.update(updateData, {
      where: { user_id: req.session.userInfo.userid },
    });
    res.send("성공");
  } catch (error) {
    console.log("User 정보 수정 DB 에러 발생", error);
  }
};

// User 찜

// 아직 다 못했음
exports.dibsMoim = async (req, res) => {
  const { moimid } = req.params;
  try {
    const isAlreadyDibs = await DibsMoim.findOne({
      where: {
        [Op.and]: [
          { user_id: req.session.userInfo.userid },
          { moim_id: moimid },
        ],
      },
    });
    await DibsMoim.create({
      user_id: req.session.userInfo.userid,
      moim_id: moimid,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.reunion_GET = (req, res) => {
  res.render("moim");
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

exports.Moimset_patch = async (req, res) => {
  //각 유저 별 모임 점수 수정
  if (req.session.userInfo) {
    try {
      const { user_review, moim_id, user_id, updatereview } = req.body;
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
  } else {
    res.redirect("/login");
  }
};
exports.MoimSet_detory = async (req, res) => {
  if (req.session.userInfo) {
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
  } else {
    res.redirect("/login");
  }
};

exports.MoimSet_POST = async (req, res) => {
  if (req.session.userInfo) {
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
  } else {
    req.redirect("/login");
  }
};

exports.moim_detail_UPDATE = async (req, res) => {
  try {
    if (req.session.userInfo) {
      const { moim_id, content, min_people } = req.body;
      await MoimDetail.update({ content, min_people }, { where: { moim_id } });
      res.send({
        result: true,
        Message: "moim 정보 업데이트에 성공하셨습니다.",
      });
    } else {
      res.send({ result: false, Message: "모임 정보 수정에 실패하였습니다." });
    }
  } catch (error) {}
};

exports.Moim_UPDATE = async (req, res) => {
  if (req.session.userInfo) {
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
  } else {
    res.redirect("/login");
  }
};

exports.MoimDetail_POST = async (req, res) => {
  if (req.session.userInfo) {
    try {
      const { moim_id, content, min_people } = req.body;
      await MoimDetail.create({ moim_id, content, min_people });
      res.json({ result: true });
    } catch {
      console.error(error);
      await Moim.destroy({ where: { moim_id } });
      //Moim_detaill 테이블에 정보 저장이 실패하였을 때, Moim table의 이전 저장 정보를 삭제한다.
      res.send({ result: false, Message: "모임 개설에 실패하였습니다." });
    }
  } else {
    res.redirect("/login");
  }
};

exports.reunion_POST = async (req, res) => {
  if (req.session.userInfo) {
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
      const { data } = await Moim.create({
        title,
        on_line,
        max_people,
        expiration_date,
        even_date,
        location,
        represent_img,
        user_id,
      });
      res.json({ result: true, userInfo: data });
    } catch (error) {
      console.error(error);
      res.send({ result: false, Message: "모임 개설에 실패하였습니다." });
    }
  } else {
    res.redirect("/login");
  }
};

//모임 추가, 모임 detail 추가, 모임 수정, 모임 detail 수정, 모임 삭제(모임 detail은 동시 삭제)
//모임 set 테이블 추가, 수정, 삭제 TEST만 남음
