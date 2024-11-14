const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const db = require("../models");
const sequelize = require("sequelize");
const { bcryptPassword, compareFunc } = require("../utils/encrypt");

const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
  Review,
} = require("../models/index");

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
      await User.create({
        user_id: userid,
        pw: hash,
        nickname: nickname,
      });
      res.send({ result: true, message: "계정이 생성되었습니다." });
    } else {
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
        req.session.userInfo = {
          userid: isExist.dataValues.user_id,
          nickname: isExist.dataValues.nickname,
        };
        res.send({
          result: true,
          message: "로그인 성공",
          nickname: req.session.userInfo.nickname,
        });
      } else {
        res.send({
          result: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }
    } else {
      res.send({
        result: false,
        message: "해당 아이디 정보가 존재하지 않습니다.",
      });
    }
  } catch (error) {
    console.log("userlogin 에러 발생", error);
  }
};

// User 비밀번호 확인
exports.userPasswordConfirm = async (req, res) => {
  const { pw } = req.body;

  try {
    const userIsExist = await User.findOne({
      where: { user_id: req.session.userInfo.userid },
    });
    if (userIsExist && compareFunc(pw, userIsExist.dataValues.pw)) {
      res.send({ result: true, message: "비밀번호가 확인되었습니다." });
    } else {
      res.send({ result: false, message: "비밀번호를 다시 확인해주세요" });
    }
  } catch (error) {
    console.log(error);
  }
};

// 프로필 수정 페이지
exports.editProfilePage = (req, res) => {
  res.render("editprofile");
};

// User 정보 수정
exports.updateUser = async (req, res) => {
  const { nickname, pw } = req.body;
  const updateData = {};
  if (nickname || pw) {
    if (nickname != null) {
      updateData.nickname = nickname;
      await Review.update(
        {
          reviewee_nickname: nickname,
        },
        { where: { reviewee_nickname: req.session.userInfo.nickname } }
      );
      await Review.update(
        {
          reviewer_nickname: nickname,
        },
        {
          where: { reviewer_nickname: req.session.userInfo.nickname },
        }
      );
    }
    if (pw != null) {
      updateData.pw = bcryptPassword(pw);
    }
  } else {
    return res.send("값을 입력해주세요");
  }
  try {
    await User.update(updateData, {
      where: { user_id: req.session.userInfo.userid },
    });
    req.session.destroy((err) => {
      if (err) {
        res.send({ result: false });
      }
      res.send({ result: true });
    });
  } catch (error) {
    console.log("User 정보 수정 DB 에러 발생", error);
  }
};

// User 삭제
exports.userDelete = async (req, res) => {
  try {
    await User.destroy({
      where: { user_id: req.session.userInfo.userid },
    });
    res.send({ result: true });
  } catch (error) {
    res.send({ result: false });
  }
};

// User 찜
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
    if (isAlreadyDibs) {
      await DibsMoim.destroy({
        where: {
          [Op.and]: [
            { user_id: req.session.userInfo.userid },
            { moim_id: moimid },
          ],
        },
      });
      res.send({ result: false, message: "찜 목록에서 제외되었습니다." });
    } else {
      await DibsMoim.create({
        user_id: req.session.userInfo.userid,
        moim_id: moimid,
        nickname: req.session.userInfo.nickname,
      });
      res.send({ result: true, message: "찜 목록에 추가되었습니다." });
    }
  } catch (error) {
    console.log(error);
  }
};

// user 정보 페이지 렌더링
exports.userInformation = async (req, res) => {
  const { review } = await User.findOne({
    where: { user_id: req.session.userInfo.userid },
  });
  let review_ = Math.round(review);
  res.render("profile", {
    review: review_,
    nickname: req.session.userInfo.nickname,
    user_id: req.session.userInfo.userid,
  });
};

// user 로그아웃
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("fail");
    }
    res.send("true");
  });
};

// review 페이지 렌더링
exports.review = async (req, res) => {
  res.render("review", {
    nickname: req.session.userInfo.nickname,
  });
};

// review 점수 주기
exports.postReview = async (req, res) => {
  const { moim_id, reviewee_nickname } = req.params;
  const { score } = req.body;
  const reviewer_nickname = req.session.userInfo.nickname;
  try {
    await Review.create({
      moim_id,
      reviewer_nickname,
      reviewee_nickname,
      score,
    });
    res.send({ result: "suceess", message: "리뷰 작성이 완료되었습니다." });
  } catch (error) {
    res.send({ result: "fail", message: "리뷰 작성에 실패했습니다." });
  }
};

// review 점수 업데이트
exports.updateReview = async (req, res) => {
  try {
    const currentDate = new Date();
    let result = await db.sequelize.query(
      `SELECT moim.moim_id, moim.even_date, review.reviewee_nickname, AVG(review.score) AS avg_score 
       FROM moim 
       JOIN review ON moim.moim_id = review.moim_id 
       JOIN user ON review.reviewee_nickname = user.nickname 
       WHERE DATE(DATE_ADD(moim.even_date, INTERVAL 3 DAY)) = :currentDate 
       GROUP BY review.reviewee_nickname, moim.moim_id`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { currentDate: currentDate.toISOString().split("T")[0] },
      }
    );
    for (const item of result) {
      let scoreChange = 0;
      const avgScore = parseFloat(item.avg_score); // avg_score 값을 숫자로 변환

      // avg_score 조건에 따른 점수 변경 값 설정
      if (avgScore >= 1 && avgScore < 2) {
        scoreChange = -0.2;
      } else if (avgScore >= 2 && avgScore < 3) {
        scoreChange = -0.1;
      } else if (avgScore >= 3 && avgScore < 4) {
        scoreChange = 0.1;
      } else if (avgScore >= 4 && avgScore < 5) {
        scoreChange = 0.2;
      }

      // user 테이블의 review 점수 업데이트
      await db.User.update(
        { review: db.sequelize.literal(`review + ${scoreChange}`) },
        { where: { nickname: item.reviewee_nickname } }
      );
    }
    res.send("리뷰 업데이트 완료");
  } catch (error) {
    "review 점수 불러오기 실패", error;
  }
};

// 참여중인 모임 가져오기
exports.participatingMoim = async (req, res) => {
  let result = await db.sequelize.query(
    `
    SELECT 
      moim.moim_id,
      moim.title,
      moim.on_line,
      moim.max_people,
      moim.location,
      moim.represent_img,
      moim_set.nickname,
      moim.category,
      DATE_FORMAT(moim.expiration_date, '%Y-%m-%d %H:%i') AS expiration_date,
      DATE_FORMAT(moim.even_date, '%Y-%m-%d %H:%i') AS even_date
    FROM 
      moim_set 
    JOIN 
      moim 
    ON 
      moim.moim_id = moim_set.moim_id 
    WHERE 
      moim_set.nickname = :nickname 
      AND moim.even_date > NOW();
    `,
    {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { nickname: req.session.userInfo.nickname },
    }
  );
  res.send(result);
};

// 참여한 모임 가져오기
exports.participatedMoim = async (req, res) => {
  let result = await db.sequelize.query(
    `
    SELECT 
      moim.moim_id,
      moim.title,
      moim.on_line,
      moim.max_people,
      moim.location,
      moim.represent_img,
      moim_set.nickname,
      moim.category,
      DATE_FORMAT(moim.expiration_date, '%Y-%m-%d %H:%i') AS expiration_date,
      DATE_FORMAT(moim.even_date, '%Y-%m-%d %H:%i') AS even_date
    FROM 
      moim_set 
    JOIN 
      moim 
    ON 
      moim.moim_id = moim_set.moim_id 
    WHERE 
      moim_set.nickname = :nickname 
      AND moim.even_date < NOW();
    `,
    {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { nickname: req.session.userInfo.nickname },
    }
  );
  res.send(result);
};

// 모집글 테스트
exports.meeting = async (req, res) => {
  res.render("meeting");
};
