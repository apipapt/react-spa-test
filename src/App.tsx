// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Login/login-page';
import ProfilePage from './Pages/Dashbaord/Profile/profile-page';
import SignupPage from './Pages/Signup/signup-page';
import ProtectedRoute from './components/protected-route';
import DashboardPage from './Pages/Dashbaord/page';
import DailySummaryPage from './Pages/Dashbaord/Summary/daily-summary-page';
import MonthlySummaryPage from './Pages/Dashbaord/Summary/monthly-summary-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-summary"
          element={
            <ProtectedRoute>
              <DailySummaryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monthly-summary"
          element={
            <ProtectedRoute>
              <MonthlySummaryPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;