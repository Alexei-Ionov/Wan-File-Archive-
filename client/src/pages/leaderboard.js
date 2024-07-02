import React from 'react';
import LeaderBoardContainer from "../components/LeaderBoardContainer";
import '../css/leaderboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
function Leaderboard() {
    return (
        <div className="leaderboard-page">
            <h1>Leaderboard</h1>
            {<FontAwesomeIcon icon={faEarthAmericas} />}
            <LeaderBoardContainer />
        </div>
    );
}

export default Leaderboard;
