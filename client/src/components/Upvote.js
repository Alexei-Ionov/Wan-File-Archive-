import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp  } from '@fortawesome/free-solid-svg-icons';
function Upvote({ handleVote , upvoteButtonClicked }) {
    return (
        <button onClick={() => handleVote(1)} style={{
            background: 'none',
            border: 'none',
            padding: '5px',
            cursor: 'pointer',
            position: 'absolute',
            top: '10px',
            left: '20px',
            color: upvoteButtonClicked ? '#C8A2C8' : 'gray',
        }}>
            <FontAwesomeIcon icon={faArrowUp} />
        </button>
    );
};
export default Upvote;