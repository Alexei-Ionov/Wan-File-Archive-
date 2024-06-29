import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

function FileMetadata({ file }) {
  const [upvoteButtonClicked, setUpvoteButton] = useState(false);
  const [downvoteButtonClicked, setDownvoteButton] = useState(false);
  const [msg, setMsg] = useState('');
  const [fileRating, setfileRating] = useState(file.rating);
  const handleUpvote = () => {
    /* toggle off other button */
    if (upvoteButtonClicked) {
      return;
    }
    if (downvoteButtonClicked) {
      setDownvoteButton(false);
    }
    setUpvoteButton(true);
    setfileRating(fileRating + 1);
    try { 
      fetch('http://localhost:8000/content/vote', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({fileid: file.fileid, vote:'1'}),
        credentials: 'include',
      }).then(response => {
        setMsg(response.msg);
      })

    } catch (err) {
      console.log(err.message);
      setMsg(err.message);
    }
    
  }
  
  

  const handleDownvote = async () => {
    if (downvoteButtonClicked) {
      return;
    }
    /* toggle off other button */
    if (upvoteButtonClicked) {
      setUpvoteButton(false);
    }
    setDownvoteButton(true);
    setfileRating(fileRating - 1);
    try { 
      fetch('http://localhost:8000/content/vote', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({fileid: file.fileid, vote:'0'}),
        credentials: 'include',
      }).then(response => {
        setMsg(response.msg);
      })

    } catch (err) {
      console.log(err.message);
      setMsg(err.message);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      padding: '20px',
      marginBottom: '20px',
      width: '300px', // Increased width
      height: '50px', // Increased height
      position: 'relative',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    }}>
      {file &&
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={handleUpvote} style={{
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
              <button onClick={handleDownvote} style={{
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
            </div>
            <div style={{ color: 'gray', position: 'absolute', top: '20px', left: '10px' }}>{fileRating}</div>
          </div>
          <h3 style={{ textAlign: 'center', margin: '0', position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>{file.filename}</h3>
          <div style={{ position: 'absolute', bottom: '10px', left: '20px', color: 'gray', fontStyle: 'italic' }}>
            Uploaded by {file.owner}
          </div>
        </React.Fragment>
      }
    </div>
  );
}

export default FileMetadata;
