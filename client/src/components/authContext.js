import React, { createContext, useState } from 'react';

const AuthContext = createContext();
const AuthProvider = ({children}) => { 
    const [user, setUser] = useState(null);
    const login = async (loginInfo) => { 
        /* loginInfo -> {email: ***, password: ***} */
        const {email, password} = loginInfo;
    
        try { 
            const response = await fetch('http://localhost:8000/login', { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email: email, password: password }),
                credentials: 'include',
            });
            if (!response.ok) { 
                const errorMsg = await response.text();
                return errorMsg;
            }
            const userData = await response.json();
            setUser(userData);
            console.log("login successful!");
            return '';
        } catch (err) {
            console.log(err.message);
        }
    };
    const logout = async () => { 
        try {
            await fetch('http://localhost:8000/logout', {
                method: 'POST',
                credentials: 'include',
            });
            setUser(null);
            console.log("logout successful!");
        } catch (err) { 
            console.log(err.message);
        }
    };
    return (
        <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>
    );
};
export {AuthContext, AuthProvider};