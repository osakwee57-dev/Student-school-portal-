import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import StudentRegister from './components/StudentRegister';
import StudentLogin from './components/StudentLogin';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Analytics />
    </Router>
  );
}
