import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import ProfileSetup from './pages/ProfileSetup';
import SymptomInsight from './pages/SymptomInsight';
import ResetPlan from './pages/ResetPlan';
import DailyCheckIn from './pages/DailyCheckIn';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import BackupRestore from './pages/BackupRestore';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/profile" element={<ProfileSetup />} />
            <Route path="/symptoms" element={<SymptomInsight />} />
            <Route path="/plan" element={<ResetPlan />} />
            <Route path="/check-in" element={<DailyCheckIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/backup" element={<BackupRestore />} />
            <Route path="*" element={<WelcomePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
