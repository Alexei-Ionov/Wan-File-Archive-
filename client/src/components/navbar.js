import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css'
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => { 
    const {user} = useContext(AuthContext);
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                <li><Link to="/content">Content</Link></li>
                <li><Link to="/contribute">Contribute</Link></li>
                <li>
                    {user ? (<Link to="/profile">{<FontAwesomeIcon icon={faUser} />}</Link>) : (<Link to="/login">Login</Link>)}
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;