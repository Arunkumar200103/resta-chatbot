// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';      // ← only here, for @tailwind directives
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
