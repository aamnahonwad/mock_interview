const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.JSON, // Stores the array of options
    allowNull: false
  },
  correctOptionIndex: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Question;
