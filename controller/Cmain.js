const { Op } = require("sequelize");
const db = require("../models");
const sequelize = require("sequelize");
const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
} = require("../models/index");

exports.index = async (req, res) => {
  const { review } = await User.findOne({
    where: { user_id: req.session.userInfo.userid },
  });

  // console.log(review);
  const img_link = `star${Math.round(review)}.jpeg`;

  // console.log(img_link);

  res.render("index", {
    img_link,
    nickname: req.session.userInfo.nickname,
    user_id: req.session.userInfo.userid,
  });
};

exports.index_POST = async (req, res) => {
  try {
    const nickname = req.session.userInfo.nickname;

    const moimSet = await MoimSet.findAll({
      where: { nickname: nickname },
      // group: "nickname"
    });
    console.log(moimSet);

    const moimId = [];
    for (let i = 0; i < moimSet.length; i++) {
      moimId.push(moimSet[i].moim_id);
    }

    const data = await Moim.findAll({
      where: { moim_id: moimId },
    });

    const recommend = await db.sequelize.query(
      `
    SELECT moim.*
  FROM moim
  JOIN (
    SELECT moim_id, COUNT(*) AS participant_count
    FROM moim_set
    GROUP BY moim_id
  ) AS moim_participants ON moim.moim_id = moim_participants.moim_id
  WHERE moim_participants.participant_count = moim.max_people - 1
  `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (data && recommend) {
      res.json({ data: data, recommend: recommend });
    } else {
      res.json({ message: "모임 정보가 없습니다." });
    }
  } catch (error) {
    res.json({
      result: false,
      Message: "모임 정보 불러오기에 실패하였습니다!",
    });
    console.log(error);
  }
};

exports.login = (req, res) => {
  res.render("login");
};

exports.signup = (req, res) => {
  res.render("signup");
};
