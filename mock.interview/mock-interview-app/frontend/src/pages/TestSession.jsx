import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [tabSwitches, setTabSwitches] = useState(0);
  
  // Create an array mapping letters to indexes
  const optionLetters = ['A', 'B', 'C', 'D'];

  // Track tab switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Timer interval: runs once per question, avoids multiple intervals
  useEffect(() => {
    if (loading || error || !session) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timerId);
  }, [loading, error, session?.currentIndex]);

  // Handle timeout action (auto move to next question or submit)
  useEffect(() => {
    if (timeLeft === 0 && session && !loading) {
      if (session.currentIndex === session.questions.length - 1) {
        submitTest();
      } else {
        nextQuestion();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/sessions/${sessionId}`);
      
      if (response.data.isCompleted) {
        navigate(`/result/${sessionId}`);
        return;
      }
      
      setSession(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load test session. The session ID may be invalid.');
      setLoading(false);
    }
  };

  const handleAnswerChange = async (optionIndex) => {
    const questionId = session.questions[session.currentIndex].id || session.questions[session.currentIndex]._id;
    
    // Update local state immediately for UI responsiveness
    const updatedSession = { ...session };
    updatedSession.answers[questionId] = {
      selectedOptionIndex: optionIndex,
      status: 'answered'
    };
    setSession(updatedSession);
  };

  const saveProgress = async (newIndex, questionId, status, selectedOptionIndex = null) => {
    try {
      await axios.post(`/api/sessions/${sessionId}/answer`, {
        questionId,
        selectedOptionIndex,
        status,
        currentIndex: newIndex
      });
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  };

  const nextQuestion = async () => {
    const questionId = session.questions[session.currentIndex].id || session.questions[session.currentIndex]._id;
    const currentAnswer = session.answers[questionId] || { status: 'unanswered', selectedOptionIndex: null };
    
    // If not answered, mark as skipped
    const status = (currentAnswer.status === 'answered' && currentAnswer.selectedOptionIndex !== null) ? 'answered' : 'skipped';
    
    const newIndex = session.currentIndex + 1;
    
    // Update local state and save to backend
    const updatedSession = { ...session, currentIndex: newIndex };
    updatedSession.answers[questionId] = { 
      selectedOptionIndex: currentAnswer.selectedOptionIndex, 
      status 
    };
    
    setTimeLeft(10);
    setSession(updatedSession);
    await saveProgress(newIndex, questionId, status, currentAnswer.selectedOptionIndex);
  };

  const prevQuestion = async () => {
    if (session.currentIndex > 0) {
      const questionId = session.questions[session.currentIndex].id || session.questions[session.currentIndex]._id;
      const currentAnswer = session.answers[questionId] || { status: 'unanswered', selectedOptionIndex: null };
      
      const newIndex = session.currentIndex - 1;
      
      const updatedSession = { ...session, currentIndex: newIndex };
      updatedSession.answers[questionId] = { 
        selectedOptionIndex: currentAnswer.selectedOptionIndex, 
        status: currentAnswer.status 
      };
      
      setTimeLeft(10);
      setSession(updatedSession);
      
      try {
        await saveProgress(newIndex, questionId, currentAnswer.status, currentAnswer.selectedOptionIndex);
      } catch (e) {}
    }
  };

  const submitTest = async () => {
    const questionId = session.questions[session.currentIndex].id || session.questions[session.currentIndex]._id;
    const currentAnswer = session.answers[questionId] || { status: 'unanswered', selectedOptionIndex: null };
    
    // Auto-skip the last question if not answered
    const status = (currentAnswer.status === 'answered' && currentAnswer.selectedOptionIndex !== null) ? 'answered' : 'skipped';
    await saveProgress(session.currentIndex, questionId, status, currentAnswer.selectedOptionIndex);

    try {
      await axios.post(`/api/sessions/${sessionId}/submit`, { tabSwitches });
      navigate(`/result/${sessionId}`);
    } catch (err) {
      alert('Failed to submit test. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading test session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel text-center">
        <div className="error-message">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  const currentQ = session.questions[session.currentIndex];
  const qId = currentQ.id || currentQ._id;
  const currentAnswer = session.answers[qId];
  const selectedIndex = currentAnswer ? currentAnswer.selectedOptionIndex : null;
  const isLastQuestion = session.currentIndex === session.questions.length - 1;

  return (
    <div className="glass-panel">
      <div className="test-header">
        <div className="domain-badge">{session.domain}</div>
        <div style={{ color: timeLeft <= 3 ? 'var(--danger)' : 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>
          Time Left: {timeLeft}s
        </div>
        <div className="question-counter">
          Question {session.currentIndex + 1} of {session.questions.length}
        </div>
      </div>

      <h2 className="question-text">{currentQ.text}</h2>

      <div className="options-list">
        {currentQ.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleAnswerChange(index)}
          >
            <span className="option-letter">{optionLetters[index]}</span>
            {option}
          </button>
        ))}
      </div>

      <div className="test-controls">
        <div className="test-controls-left">
          <button 
            className="btn btn-secondary" 
            onClick={prevQuestion}
            disabled={session.currentIndex === 0}
          >
            Previous
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/')}
            title="Saves progress and returns to home menu"
          >
            Save & Exit
          </button>
        </div>
        <div className="test-controls-right">
          {isLastQuestion ? (
            <button className="btn btn-primary" onClick={submitTest}>
              Submit Test
            </button>
          ) : (
             <button className="btn btn-primary" onClick={nextQuestion}>
              {selectedIndex !== null ? 'Next Question' : 'Skip Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSession;
