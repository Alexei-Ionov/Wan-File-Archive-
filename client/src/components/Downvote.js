import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown  } from '@fortawesome/free-solid-svg-icons';
function Downvote({ handleVote , downvoteButtonClicked }) {
    return (
        <button onClick={() => handleVote(-1)} style={{
            background: 'none',
            border: 'none',
            padding: '5px',
            cursor: 'pointer',
            position: 'absolute',
            top: '30px',
            left: '20px',
            color: downvoteButtonClicked ? '#C8A2C8' : 'gray',
            }}>
            <FontAwesomeIcon icon={faArrowDown} />
        </button>
    );
};
export default Downvote;