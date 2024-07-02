import React, { useEffect, useState } from 'react';
import LeaderBoardSlot from './LeaderBoardSlot';
import '../css/leaderboard.css';

function LeaderBoardContainer() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`http://localhost:8000/leaderboard`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.log("Failed to fetch leaderboard");
                    return;
                }

                const leaders = await response.json();
                setUsers(leaders);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchLeaderboard();
        const intervalId = setInterval(() => {
            fetchLeaderboard();
        }, 60000); //
         // Cleanup function to clear interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="leaderboard-container">
            {users.map((user, index) =>
                <LeaderBoardSlot key={user.username} user={user} index={index} />
            )}
        </div>
    );
}

export default LeaderBoardContainer;
