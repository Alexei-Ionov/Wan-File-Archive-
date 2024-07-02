import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../css/fileMetadata.css';

function FileMetadata({ file, ownerRating, setOwnerRating }) {
  const [upvoteButtonClicked, setUpvoteButton] = useState(file.upvoted);
  const [downvoteButtonClicked, setDownvoteButton] = useState(file.downvoted);
  const [msg, setMsg] = useState('');
  const [fileRating, setFileRating] = useState(file.rating);

  const handleVote = async (vote) => {
    // Prevent upvoting/downvoting consecutively
    if ((vote === 1 && upvoteButtonClicked) || (vote === -1 && downvoteButtonClicked)) {
      return;
    }

    try {
      // Update button states based on vote
      if (vote === 1) {
        setUpvoteButton(true);
        setDownvoteButton(false);
      } else if (vote === -1) {
        setDownvoteButton(true);
        setUpvoteButton(false);
      }

      // Update ratings
      setFileRating(fileRating + vote);

      // Update owner rating if applicable
      if (setOwnerRating) {
        setOwnerRating(ownerRating + vote);
      }

      // Send vote request to server
      const reqVote = vote === -1 ? '-1' : '1';
      const response = await fetch('http://localhost:8000/content/vote', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ fileid: file.fileid, vote: reqVote }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to vote");
      }
      const data = await response.text();
      setMsg(data.msg); // Update message state based on server response
    } catch (err) {
      console.error(err.message);
      setMsg(err.message);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      padding: '20px',
      marginBottom: '20px',
      width: '300px',
      height: '50px',
      position: 'relative',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    }}>
      {file &&
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

          
            <div style={{ color: 'gray', position: 'absolute', top: '20px', left: '10px' }}>{fileRating}</div>
          </div>
          <h3 style={{ textAlign: 'center', margin: '0', position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>{file.filename}</h3>
           <Link to={`/viewProfile/${file.ownerid}`} className="link-style">
          Uploaded by {file.owner}
          </Link>
        </React.Fragment>
      }
    </div>
  );
}

export default FileMetadata;
