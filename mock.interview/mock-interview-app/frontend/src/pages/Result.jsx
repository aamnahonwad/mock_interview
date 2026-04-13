import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.post(`/api/sessions/${sessionId}/submit`);
        setResult(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load test results.');
        setLoading(false);
      }
    };

    fetchResult();
  }, [sessionId]);

  const restartTest = () => {
    // Navigate home to start a new test (keeps domains fresh)
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Calculating your result...</p>
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

  // Calculate percentage
  const percentage = result.totalQuestions > 0 ? (result.score / result.totalQuestions) * 100 : 0;
  
  // Determine performance message
  let performanceMsg = "Needs Practice";
  let performanceColor = "var(--danger)";
  
  if (percentage >= 80) {
    performanceMsg = "Excellent Work!";
    performanceColor = "var(--success)";
  } else if (percentage >= 60) {
    performanceMsg = "Good Effort!";
    performanceColor = "var(--primary)";
  } else if (percentage >= 40) {
    performanceMsg = "Fair Attempt";
    performanceColor = "var(--warning)";
  }

  return (
    <div className="glass-panel">
      <div className="results-header">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Test Complete</h2>
        <p style={{ color: 'var(--text-muted)' }}>Here is your performance summary</p>
        
        <div className="score-display" style={{ color: performanceColor }}>
          {result.score} <span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/ 10</span>
        </div>
        <div style={{ color: performanceColor, fontWeight: '600', fontSize: '1.25rem', marginBottom: '2rem' }}>
          {performanceMsg}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item stat-success">
          <div className="stat-value">{result.correct}</div>
          <div className="stat-label">Correct Answers</div>
        </div>
        <div className="stat-item stat-danger">
          <div className="stat-value">{result.wrong}</div>
          <div className="stat-label">Wrong Answers</div>
        </div>
        <div className="stat-item stat-warning">
          <div className="stat-value">{result.skipped}</div>
          <div className="stat-label">Skipped</div>
        </div>
        <div className="stat-item stat-neutral">
          <div className="stat-value">{result.totalQuestions}</div>
          <div className="stat-label">Total Questions</div>
        </div>
        <div className="stat-item stat-neutral">
          <div className="stat-value">{result.tabSwitches !== undefined ? result.tabSwitches : 0}</div>
          <div className="stat-label">Tab Switches</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={restartTest}>
          Take Another Test
        </button>
      </div>
    </div>
  );
};

export default Result;
