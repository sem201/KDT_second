/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const { text } = require("express");
const { Sequelize } = require(".");

const MoimDetailModel = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "moim_detail",
    {
      moim_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      min_people: {
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

module.exports = MoimDetailModel;
