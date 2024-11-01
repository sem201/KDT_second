const Sequelize = require("sequelize");
const config = require(__dirname + "/../config/config.js")["development"];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require("./User")(sequelize, Sequelize.DataTypes);
const Moim = require("./Moim")(sequelize, Sequelize.DataTypes);
const MoimDetail = require("./MoimDetail")(sequelize, Sequelize.DataTypes);
const MoimSet = require("./MoimSet")(sequelize, Sequelize.DataTypes);

Moim.hasOne(MoimDetail, {
  foreignKey: "moim_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
MoimDetail.belogsTo(Moim, { foreignKey: "moim_id" });

Moim.belogsToMany(User, { through: "moim_set", foreignKey: "user_id" });
User.belogsToMany(Moim, { through: "moim_set", foreignKey: "moim_id" });

db.User = User;
db.Moim = Moim;
db.MoimDetail = MoimDetail;
db.MoimSet = MoimSet;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// TODO: User 모델 db 객체에 저장

module.exports = db;
