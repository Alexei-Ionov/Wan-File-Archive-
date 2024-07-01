import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import FilesContainer from '../components/FilesContainer';
function Profile() { 
    const { user, logout} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate(); // Get the history instance
    const [userFiles, setUserFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [viewFilesMsg, setViewFilesMsg] = useState("");
    const [userRating, setUserRating] = useState(0);

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
    const fetchUserData = async () => { 
        console.log('fetching user profile...');
        try { 
            const params = new URLSearchParams({
                ownerid: `${user.userID}`
            })
            const response = await fetch(`http://localhost:8000/profile?${params.toString()}`, { 
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) { 
                console.log("Failed to fetch user profile");
                throw new Error("Failed to fetch user profile");
            }
            const profile = await response.json();
            setUserData(profile);
            setUserRating(profile.rating);
            
        } catch (err) {
            console.log(err.message);
        }
    };
    const fetchUserFiles = async () => {
        console.log('fetching files for user profile...');
        setLoadingFiles(true);
        setViewFilesMsg("");
        try { 
            const params = new URLSearchParams({
                ownerid: `${user.userID}`
            })
            const response = await fetch(`http://localhost:8000/profile/content?${params.toString()}`, { 
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) { 
                console.log("Failed to fetch user profile");
                throw new Error("Failed to fetch user profile");
            }
            const reqFiles = await response.json();
            setLoadingFiles(false);
            if (reqFiles.length) { //there are more files to view
                setUserFiles(reqFiles);
                // setUserFiles(userFiles.concat(reqFiles));
                // setFilesLoaded(filesLoaded + reqFiles.length);
            } else { 
                setViewFilesMsg("No more files to view as of yet!");
                console.log("no more files to view!");
            }
        } catch (err) {
            console.log(err.message);
            setLoadingFiles(false);
        }
    };
    useEffect(() => {
        const fetchUserProfile = async () => { 
            await fetchUserData();
            await fetchUserFiles();
        };
        if (user) { 
            fetchUserProfile();
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
            <p>Rating: {userRating}</p>
            < FilesContainer files={userFiles} ownerRating={userRating} setOwnerRating={setUserRating}/>
            <br></br>
            {/* <button onClick={() => {
                fetchUserFiles();
            }}>View More Results</button> */}
            <br></br>
            {viewFilesMsg && <p>{viewFilesMsg}</p>}
            {loadingFiles && <p>Loading files...</p>}
            <br></br>
            <button onClick={handleLogoutSubmit}>Logout</button>
        </div>
    );
};
export default Profile;