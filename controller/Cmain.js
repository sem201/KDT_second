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

exports.login = (req, res) => {
  res.render("login");
};
