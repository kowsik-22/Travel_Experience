import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import React from 'react'

import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Home from './pages/home/home';


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}


const Root = () => {

  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  )
}



export default App