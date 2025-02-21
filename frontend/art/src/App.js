import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import ScheduleEmail from './components/ScheduleEmail';
import ScheduledEmails from './components/ScheduledEmails';
import UpdateProfile from './components/UpdateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Profile" element={<Profile/>} />
        <Route path="/update_profile" element={<UpdateProfile/>} />
        <Route path="/schedule_emails" element={<ScheduleEmail/>} />
        <Route path="/scheduled_emails" element={<ScheduledEmails/>} />

        
      </Routes>
    </Router>
  );
}

export default App;
