/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const MoimModel = (Sequelize, DataTypes) => {
  return Sequelize.define(
    "moim",
    {
      moim_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.VARCHAR(30),
        allowNull: false,
      },
      max_people: {
        type: DataTypes.INTEGER,
      },
      expiration_date: {
        type: DataTypes.DATETIME,
        allowNull: false,
      },
      even_date: {
        type: DataTypes.DATETIME,
        allowNull: false,
      },
      location: {
        type: DataTypes.VARCHAR(25),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
};
