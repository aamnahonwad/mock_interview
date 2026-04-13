const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TestSession = sequelize.define('TestSession', {
  sessionId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questions: {
    type: DataTypes.JSON, // Array of Question IDs
    allowNull: false
  },
  answers: {
    type: DataTypes.JSON, // Object mapping questionId -> { selectedOptionIndex, status }
    defaultValue: {}
  },
  currentIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tabSwitches: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  correctCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wrongCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  skippedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = TestSession;
