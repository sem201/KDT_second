/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const UserModel = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "user",
    {
      user_id: {
        type: DataTypes.VARCHAR(20),
        primaryKey: true,
        allowNull: false,
      },
      pw: {
        type: DataTypes.VARCHAR(20),
        allowNull: false,
      },
      name: {
        type: DataTypes.VARCHAR(10),
        allowNull: false,
      },
      review: {
        type: DataTypes.FLOAT(2, 1),
        defaultValue: 5.0,
      },
    },
    {
      freezeTableName: true,
    }
  );
};

module.exports = UserModel;
