// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBot from './ChatBot';
import './App.css';        // ← your custom styles (message bubbles, scrollbar, etc.)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}

export default App;
