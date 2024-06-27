import React, { useContext, useState } from 'react';
import { AuthContext } from '../components/authContext'; 
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try { 
        const response = await login({ email, password });
        /* response = '' if no error, else error message */
        setErrorMessage(response);
        setEmail('');
        setPassword('');
        navigate('/profile');
    } catch (err) { 
        console.log(err.message);
    }
    
  };

  return (
    <div>
      <h1>Login</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <br></br>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
