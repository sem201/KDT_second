/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const ReviewModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      reviewer_nickname: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      reviewee_nickname: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
};

module.exports = ReviewModel;
