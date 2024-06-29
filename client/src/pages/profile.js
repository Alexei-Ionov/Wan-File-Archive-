import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { FilesContainer } from '../components/FilesContainer';
function Profile() { 
    const { user, logout} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate(); // Get the history instance
    const [userFiles, setUserFiles] = useState([]);

    /* 
    userData = {
        email: '..',
        rating: ..,
        username: '...', 

        ... (files) ...
    }

    */
    const handleLogoutSubmit = async (event) => { 
        event.preventDefault();
        try { 
            console.log("logging out user");
            await logout(); 
            navigate('/'); //redirect to home page
            console.log("logged user out");
        } catch (err) { 
            console.log(err.message);
        }
    }
    useEffect(() => {
        const fetchUserData = async () => { 
            console.log("fetching user data...");
            try { 
                const response = await fetch("http://localhost:8000/profile", { 
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) { 
                    throw new Error("Failed to fetch user profile");
                }
                const profile = await response.json();
                const userData = profile.userData;
                const files = profile.files;
                setUserData(userData);
                setUserFiles(files);
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
            < FilesContainer files={userFiles} />
            <br></br>
            <br></br>
            <button onClick={handleLogoutSubmit}>Logout</button>
        </div>
    );
};
export default Profile;
