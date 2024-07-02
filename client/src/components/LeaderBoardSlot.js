import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons'; // Assuming you have icons imported
import '../css/leaderboard.css';
import { Link } from 'react-router-dom';

function LeaderBoardSlot({ user, index }) {
    return (
        <div className="leaderboard-slot">
            <div className="position-icon">
                {index === 0 && <FontAwesomeIcon icon={faTrophy} style={{ color: '#FFD700' }} />} {/* Gold */}
                {index === 1 && <FontAwesomeIcon icon={faTrophy} style={{ color: '#C0C0C0' }} />} {/* Silver */}
                {index === 2 && <FontAwesomeIcon icon={faTrophy} style={{ color: '#CD7F32' }} />} {/* Bronze */}
            </div>
            <div className="user-info">
                <div>
                    <Link to={`/viewProfile/${user.id}`} className="leaderboard-link-style">{user.username}</Link>
                </div>
                <p>Rating: {user.rating}</p>
            </div>
        </div>
    );
}

export default LeaderBoardSlot;
