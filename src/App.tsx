import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import HomePage from './views/HomePage';
import SignUpPage from './views/SignupPage';
import Dashboard from './views/Dashboard';
import { DarkModeProvider } from './contexts/DarkModeContext';

const App: React.FC = () => {
  return (

    <DarkModeProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
};

export default App;