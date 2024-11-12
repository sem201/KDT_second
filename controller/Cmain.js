const {
  Moim,
  User,
  MoimDetail,
  MoimSet,
  DibsMoim,
} = require("../models/index");

exports.index = async (req, res) => {
  const {review} = await User.findOne({
    where: {user_id: req.session.userInfo.userid},
  });

  // console.log(review);
  const img_link = `star${Math.round(review)}.jpeg`;
  
  // console.log(img_link);
  
  
  res.render("index", {img_link, nickname: req.session.userInfo.nickname, user_id: req.session.userInfo.userid});
};

exports.index_POST = async (req, res) => {
  try {
    const nickname = req.session.userInfo.nickname;

    const data = await Moim.findAll({
      where: {nickname: nickname}
    });

    if(data) {
      res.json({data: data});
    } else {
      res.json({message: "참여중인 모임이 없습니다."});
    }
  } catch (error) {
    res.json({
      result: false,
      Message: "모임 정보 불러오기에 실패하였습니다!",
    });
  }
};

exports.login = (req, res) => {
  res.render("login");
};

exports.signup = (req, res) => {
  res.render("signup");
};
