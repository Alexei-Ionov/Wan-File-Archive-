import React from 'react';
import LeaderBoardContainer from "../components/LeaderBoardContainer";
import '../css/leaderboard.css';
function Leaderboard() {
    return (
        <div className="leaderboard-page">
            <h1>Leaderboard</h1>
            <LeaderBoardContainer />
        </div>
    );
}

export default Leaderboard;
