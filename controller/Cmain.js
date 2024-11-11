exports.index = (req, res) => {
  res.render("index");
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
