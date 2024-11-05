/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

const ReviewModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "review",
    {
      moim_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "moim_set",
          key: "moim_id",
        },
      },
      reviewer_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      reviewee_id: {
        type: DataTypes.STRING(20),
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
