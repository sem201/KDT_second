exports.index = (req, res) => {
  res.render("index");
};

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

  console.log(review);
  const img_link = `star${Math.round(review)}.jpeg`;

  console.log(img_link);

  res.render("index", {
    img_link,
    nickname: req.session.userInfo.nickname,
    user_id: req.session.userInfo.userid,
  });
};

exports.index_get = async (req, res) => {
  const moims = await MoimSet.findAll({
    where: { user_id: req.session.userInfo.userid },
    group: "user_id",
  });
  console.log(moims);
  res.json(moims);
};

exports.login = (req, res) => {
  if (req.session.userInfo) {
    return res.redirect("/home");
  }
  res.render("login");
};

exports.signup = (req, res) => {
  res.render("signup");
};
