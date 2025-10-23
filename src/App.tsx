// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Login/login-page';
import ProfilePage from './Pages/Dashbaord/Profile/profile-page';
import SignupPage from './Pages/Signup/signup-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfilePage />}>
          {/* Rute dalam tata letak dashboard */}
          {/* <Route index element={<DashboardHome />} /> */}
          {/* <Route path="analytics" element={<Analytics />} /> */}
          {/* Tambahkan rute lain di sini */}
        </Route>
        {/* Rute tanpa tata letak dashboard (misalnya Login) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;