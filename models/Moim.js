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
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      on_line: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      max_people: {
        type: DataTypes.INTEGER,
      },
      expiration_date: {
        type: DataTypes.DATE,
      },
      even_date: {
        type: DataTypes.DATE,
      },
      location: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      represent_img: {
        type: DataTypes.STRING(255),
      },
      category: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};

module.exports = MoimModel;
