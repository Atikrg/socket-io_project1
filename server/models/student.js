// models/student.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as needed

const Student = sequelize.define('Student', {
  rollno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'students',
  timestamps: false
});

module.exports = Student;

