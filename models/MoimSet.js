/**
 * @param {import('sequelize').Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const { DataTypes } = require("sequelize");

const MoimSetModel = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "moim_set",
    {
      moim_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      user_review: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};

module.exports = MoimSetModel;
