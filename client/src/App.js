import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Contribute from './pages/contribute';
import Profile from './pages/profile';
import NavBar from './components/Navbar';
import Login from './pages/login';
import SignUp from './pages/signup';
import Content from './pages/content';
import { AuthProvider } from './components/AuthContext';
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
            <Route path="/content" element = {<Content/>}/>
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
