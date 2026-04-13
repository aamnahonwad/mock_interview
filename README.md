# Mock Interview Quiz Platform

## Overview

The Mock Interview Quiz Platform is a web-based application that allows users to practice technical interview questions based on their chosen programming language.

It evaluates user performance by tracking:

* Correct answers
* Wrong answers
* Total questions attempted
* Tab switching behavior (to detect distractions or cheating)

This helps users simulate real interview environments and improve problem-solving skills.

---

## Features

* Select quiz based on programming language (Java, Python, JavaScript, etc.)
* Multiple-choice questions (MCQs)
* Real-time performance tracking:

  * Total questions
  * Correct answers
  * Wrong answers
  * Score calculation
* Tab switch detection:

  * Counts how many times the user leaves the quiz tab
* Instant result generation after quiz completion
* Interview-like environment simulation

---

## Tech Stack

* Backend: Node.js
* Frontend: HTML, CSS, JavaScript
* Runtime: Node.js

## How It Works

1. User selects a programming language.
2. Quiz starts with multiple-choice questions.
3. System tracks:

   * Answers selected
   * Time spent
   * Tab switching events
4. After completion:

   * Score is calculated
   * Summary report is displayed

---

## Result Calculation

Score is calculated using:

Score = (Correct Answers / Total Questions) * 100

The system also tracks:

* Total Questions Attempted
* Correct Answers
* Wrong Answers
* Tab Switch Count

---

## Tab Switch Detection

The application detects tab switching using browser events such as:

* visibilitychange
* blur / focus

Each tab switch is recorded and included in the final report.

---

## Future Improvements

* User authentication (login/signup)
* Detailed analytics dashboard
* AI-based question recommendations
* Mobile responsiveness
* Database integration (MongoDB)


