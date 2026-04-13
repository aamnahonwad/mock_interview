const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./db');
const mysql = require('mysql2/promise');

const apiRoutes = require('./routes/api');
const Question = require('./models/Question');
const TestSession = require('./models/TestSession');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

// Database initialization and connection
const initDb = async () => {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root'
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'mock_interview_db'}\`;`);
    await connection.end();

    // Sync Sequelize models
    await sequelize.authenticate();
    console.log('MySQL connected via Sequelize');
    
    await sequelize.sync({ alter: true }); // Create or update tables if they don't exist
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initDb();
