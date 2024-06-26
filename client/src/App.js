import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Contribute from './pages/contribute';
import Profile from './pages/profile';
import NavBar from './components/navbar';
import Login from './pages/login';
import SignUp from './pages/signup';
import { AuthProvider } from './components/authContext';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <NavBar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/contribute" element={<Contribute/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
