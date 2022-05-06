'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Coupon.init({
    event: DataTypes.BOOLEAN,
    category: DataTypes.BOOLEAN,
    book: DataTypes.BOOLEAN,
    bookId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    percent: DataTypes.INTEGER,
    nominal: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Coupon',
  });
  return Coupon;
};