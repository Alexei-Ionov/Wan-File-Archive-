import React, { useState } from 'react';
function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

   
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try { 
            if (password1 !== password2) { 
                setErrorMessage("Passwords don't match!");
                throw new Error("Passwords don't match!");
            }
            const response = await fetch("http://localhost:8000/signup", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, username, password1, password2 })
            });
            if (!response.ok) {
                const message = await response.text();
                setErrorMessage(message); 
                throw new Error("Failed to create account");
            }
            const message = await response.text();
            console.log(message);
            setEmail('');
            setUsername('');
            setPassword1('');
            setPassword2('');
            setSuccessMessage('Account created!');
        } catch (err) { 
            console.log(err.message);
            return 
        }
    };


    return (
        <div>
            <h1>Sign Up</h1>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <br></br>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
                <br />
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
                <label htmlFor="password1">Password:</label>
                <input
                type="password"
                id="password1"
                name="password1"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
                />
                <br />
                <label htmlFor="password2">Confirm Password:</label>
                <input
                type="password"
                id="password2"
                name="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                />
                <br />
                <button type="submit">Sign Up</button>
                <br></br>
                <p>{successMessage}</p>
            </form>
        </div>
    );
}

export default SignUp;