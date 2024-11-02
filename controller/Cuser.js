const { Op } = require("sequelize");
const { bcryptPassword, compareFunc } = require("../utils/encrypt");

const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
} = require("../models/index");

exports.index = (req, res) => {
  res.render("index");
};

// User 회원가입
exports.postUser = async (req, res) => {
  try {
    const { userid, pw, nickname } = req.body;
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
    const hashedPw = compareFunc(pw);
    const isExist = await User.findOne({
      where: { [Op.or]: [{ user_id: userid }, { pw: hashedPw }] },
    });
    if (isExist) {
      console.log("로그인 성공");
      res.send({ result: true, message: "로그인 성공" });
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
  try {
  } catch (error) {
    console.log(error);
  }
};

// User 정보 수정
exports.updateUser = async (req, res) => {
  try {
    const { nickname, pw } = req.body;
  } catch (error) {
    console.log("User 정보 수정 DB 에러 발생", error);
  }
};
