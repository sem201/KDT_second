/**
 * @param {import('sequelize').Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const { DataTypes } = require("sequelize");

const MoimSetModel = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "moim_set",
    {
      user_review: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
};

module.exports = MoimSetModel;
