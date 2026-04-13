import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TestSession from './pages/TestSession';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Mock Interview Master</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test/:sessionId" element={<TestSession />} />
            <Route path="/result/:sessionId" element={<Result />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
