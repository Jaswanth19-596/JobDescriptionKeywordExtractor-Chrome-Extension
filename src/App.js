import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Popup from './Popup';
import Options from './Options';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Popup />} />
      <Route path="/options" element={<Options />} />
    </Routes>
  );
}

export default App;
