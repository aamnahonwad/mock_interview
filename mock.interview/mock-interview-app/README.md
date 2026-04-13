# Mock Interview Web Application

A full-stack web application designed to help users prepare for interviews by taking 10-question MCQ tests in various domains (e.g., Java, Python, SQL). Built with React (Frontend), Node.js & Express (Backend), and MongoDB.

## Features Included
- **Domain Selection**: Chooses dynamically from available questions in the database.
- **Beautiful UI**: Built with modern "Glassmorphism" styling, custom animations, and responsive layouts.
- **Test Session Tracking**: Allows navigation (Next, Prev), skipping questions, and auto-saves progress so users can resume anytime by maintaining session ID.
- **Detailed Results**: Shows Correct, Wrong, Skipped, and Total Score after final submission.

## Directory Structure
- `backend/` - Node.js Express API and MongoDB Mongoose Models
- `frontend/` - React SPA initialized with Vite

## Setup Instructions

Since Node.js was not installed currently on your command line environment, all code has been scaffolded manually for you. Please make sure that you install Node.js (v16+) and MongoDB before running this.

### 1. Database Setup
Ensure you have MySQL installed and running locally on port `3306` (default). You must define a root password and update the `.env` file credentials inside `backend/.env` according to your local MySQL configuration.

By default it uses:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=mock_interview_db
```

### 2. Start the Backend API
1. Open a terminal and navigate to the backend folder:
   ```cmd
   cd backend
   ```
2. Install dependencies:
   ```cmd
   npm install
   ```
3. Seed the database with sample MCQ questions:
   ```cmd
   npm run seed
   ```
4. Start the server (runs on `http://localhost:5000`):
   ```cmd
   npm start
   ```

### 3. Start the Frontend Application
1. Open a new terminal and navigate to the frontend folder:
   ```cmd
   cd frontend
   ```
2. Install dependencies:
   ```cmd
   npm install
   ```
3. Start the Vite development server:
   ```cmd
   npm run dev
   ```

4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

Enjoy your Mock Interview Application!
