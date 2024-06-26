import React, { createContext, useState } from 'react';

const AuthContext = createContext();
const AuthProvider = ({children}) => { 
    const [user, setUser] = useState(null);
    const login = async (loginInfo) => { 
        /* loginInfo -> {email: ***, password: ***} */
        const email = loginInfo.email;
        const password = loginInfo.password;
        try { 
            const response = await fetch('http://localhost:8000/login', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) { 
                throw new Error("Failed to login");
            }
            const userData = await response.json();
            setUser(userData);
            console.log("login successful!");
        } catch (err) {
            console.log(err.message);
        }
    };
    const logout = async () => { 
        try {
            await fetch('http://localhost:8000/login', {
                method: 'POST',
            });
            setUser(null);
        } catch (err) { 
            console.log(err.message);
        }
    };
    return (
        <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>
    );
};
export {AuthContext, AuthProvider};