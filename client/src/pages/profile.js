import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../components/authContext'; 

function Profile() { 
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    /* 
    userData = {
        email: '..',
        rating: ..,
        username: '...', 

        ... (files) ...
    }

    */
    useEffect(() => {
        const fetchUserData = async () => { 
            try { 
                const response = await fetch("http://localhost:8000/profile", { 
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) { 
                    throw new Error("Failed to fetch user profile");
                }
                const user = await response.json();
                setUserData(user);
            } catch (err) { 
                console.log(err.message);
            }
        };
        if (user) { 
            fetchUserData();
        }
    }, [user]);
    if (!userData) { 
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }
    
    return (
        <div>
            <h1>Profile</h1>
            <br></br>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <p>Rating: {userData.rating}</p>
        </div>
    );
};
export default Profile;
