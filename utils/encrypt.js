const bcrypt = require("bcrypt");

// 비밀번호 암호화 함수 => (선택) 가능하다면 비밀번호 암호화와 관련된 별도의 모듈로 작성해보기! (utils/encrypt.js)
const saltRounds = 11;

// TODO: 비밀번호를 해싱하는 함수 정의 (bcryptPassword)
const bcryptPassword = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

// TODO: 비밀번호와 원본 비번을를 비교하는 함수 정의 (compareFunc)
const compareFunc = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};

// q비밀번호 암호화함수 => 선택 가능하다면 비밀번호

module.exports = {
  bcryptPassword,
  compareFunc,
};
