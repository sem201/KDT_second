/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const DibsMoimModel = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "dibs_moim",
    {},
    {
      freezeTableName: true,
    }
  );
};

module.exports.DibsMoimModel;
