// frontend/src/main.jsx

import React from 'react'; // Ubah import ini
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  // Hapus tag <StrictMode> dari sini
  <App />
);