import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './css/navbar.css'
import { AuthContext } from './authContext';

const NavBar = () => { 
    const {user} = useContext(AuthContext);
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/contribute">Contribute</Link></li>
                <li>
                    {user ? (<Link to="/profile">Profile</Link>) : (<Link to="/login">Login</Link>)}
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;