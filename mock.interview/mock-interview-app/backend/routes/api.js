const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db');
const Question = require('../models/Question');
const TestSession = require('../models/TestSession');

// Get all available domains
router.get('/domains', async (req, res) => {
  try {
    // Get unique domains in Sequelize MySQL
    const domains = await Question.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('domain')), 'domain']]
    });
    res.json(domains.map(d => d.domain));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// Start a new test session
router.post('/sessions/start', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Fetch up to 10 random questions for the domain in MySQL
    const questions = await Question.findAll({
      where: { domain },
      order: sequelize.random(),
      limit: 10
    });

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this domain' });
    }

    const questionIds = questions.map(q => q.id);

    // Initialize answers object
    const answers = {};
    questionIds.forEach(id => {
      answers[id.toString()] = { selectedOptionIndex: null, status: 'unanswered' };
    });

    const session = await TestSession.create({
      sessionId: uuidv4(),
      domain,
      questions: questionIds,
      answers,
      totalQuestions: questionIds.length
    });

    res.json({
      sessionId: session.sessionId,
      domain: session.domain,
      totalQuestions: session.totalQuestions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// Get session details (for resuming/playing)
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await TestSession.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Fetch the actual questions based on the stored IDs
    const questions = await Question.findAll({
      where: {
        id: session.questions
      },
      attributes: { exclude: ['correctOptionIndex'] } // Don't send answers to client
    });

    // Reorder questions to match the original array stored in session
    const orderedQuestions = session.questions.map(id => questions.find(q => q.id === id));
    
    const sessionData = session.toJSON();
    sessionData.questions = orderedQuestions;

    res.json(sessionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Save an answer or skip
router.post('/sessions/:sessionId/answer', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, selectedOptionIndex, status, currentIndex } = req.body;

    const session = await TestSession.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    if (session.isCompleted) {
      return res.status(400).json({ error: 'Session is already completed' });
    }

    // In Sequelize JSON columns, we need to explicitly mark it as changed
    const updatedAnswers = { ...session.answers };
    updatedAnswers[questionId] = { selectedOptionIndex, status };
    
    session.answers = updatedAnswers;
    session.changed('answers', true);

    if (currentIndex !== undefined) {
      session.currentIndex = currentIndex;
    }

    await session.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

// Submit test and calculate score
router.post('/sessions/:sessionId/submit', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { tabSwitches = 0 } = req.body;
    const session = await TestSession.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.isCompleted) {
      return res.json({
        score: session.score,
        totalQuestions: session.totalQuestions,
        correct: session.correctCount,
        wrong: session.wrongCount,
        skipped: session.skippedCount,
        tabSwitches: session.tabSwitches
      });
    }

    // Fetch the correct answers
    const questions = await Question.findAll({
      where: {
        id: session.questions
      }
    });

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questions.forEach(q => {
      const answer = session.answers[q.id.toString()];
      if (answer && answer.status === 'answered' && answer.selectedOptionIndex !== null) {
        if (answer.selectedOptionIndex === q.correctOptionIndex) {
          correctCount++;
        } else {
          wrongCount++;
        }
      } else {
        skippedCount++; // Catches both 'skipped' and 'unanswered' states
      }
    });

    session.isCompleted = true;
    session.score = correctCount;
    session.correctCount = correctCount;
    session.wrongCount = wrongCount;
    session.skippedCount = skippedCount;
    session.tabSwitches = tabSwitches;
    await session.save();

    res.json({
      score: session.score,
      totalQuestions: session.totalQuestions,
      correct: correctCount,
      wrong: wrongCount,
      skipped: skippedCount,
      tabSwitches: session.tabSwitches
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit session' });
  }
});

module.exports = router;
