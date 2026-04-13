import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.get('/api/domains');
        setDomains(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load domains. Make sure the backend is running.');
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const startTest = async (domain) => {
    try {
      const response = await axios.post('/api/sessions/start', { domain });
      const { sessionId } = response.data;
      navigate(`/test/${sessionId}`);
    } catch (err) {
      alert('Failed to start test. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading available domains...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="app-header" style={{ marginBottom: '2rem' }}>
        <h2>Choose Your Domain</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Select a topic to start your 10-question mock interview</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="grid-container">
        {domains.map((domain, index) => (
          <div 
            key={index} 
            className="domain-card"
            onClick={() => startTest(domain)}
          >
            <h3>{domain}</h3>
            <p>10 Questions</p>
          </div>
        ))}
      </div>
      
      {domains.length === 0 && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No domains found in the database. Please run the seed script on the backend.
        </div>
      )}
    </div>
  );
};

export default Home;
