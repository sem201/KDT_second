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
