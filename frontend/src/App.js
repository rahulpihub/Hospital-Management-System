import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register'; // Registration Page
import Login from './Login'; // Login Page
import StaffHome from './staffhome';    
import Admin from './admin';
import ForgotPassword from './forgotpassword';
import ResetPassword from './resetpassword';
import DoctorHomepage from './dochomepage';
import AdminCreateAccount from './admincreateaccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="staffhomepage" element={<StaffHome />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/dochomepage" element={<DoctorHomepage />} />
        <Route path="/admin-create-account" element={<AdminCreateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
