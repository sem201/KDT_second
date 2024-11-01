/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const { Sequelize } = require(".");

const MoimDetailModel = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "moim_detail",
    {
      content: {
        type: DataTypes.VARCHAR(255),
        allowNull: true,
      },
      represent_img: {
        type: DataTypes.VARCHAR(255),
        allowNull: true,
      },
      min_people: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
};

module.exports = MoimDetailModel;
