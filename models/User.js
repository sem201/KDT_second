/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const UserModel = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "user",
    {
      user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      pw: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      review: {
        type: DataTypes.FLOAT(2, 1),
        defaultValue: 3.0,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};

module.exports = UserModel;
