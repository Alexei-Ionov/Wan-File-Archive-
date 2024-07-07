import React, { useState } from 'react';

const CommentBox = ({ fileid, parentid, commenter_username, setCommentCount }) => {
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => { 
    try { 
      const response = await fetch('http://localhost:8000/content/add-comment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ fileid, parentid, commenter_username, comment }),
        credentials: 'include',
      });
      const response_msg = await response.json();
      if (response_msg && response_msg.success === 1) {
        setCommentCount(prev => prev + 1);
        setMsg("Comment added successfully!");
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setComment('');
    }
  };

  return (
    <div style={styles.container}>
      <textarea
        value={comment}
        onChange={handleCommentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Add a Comment"
        style={{ ...styles.textarea, height: isFocused ? '100px' : '30px' }}
      />
      <div style={styles.buttonContainer}>
        <button onClick={handleSubmit} style={styles.button}>
          Comment
        </button>
      </div>
      <h3>{msg}</h3>
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '10px',
  },
  textarea: {
    width: '100%',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    resize: 'none',
    boxSizing: 'border-box',
    transition: 'height 0.3s ease-in-out',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'absolute',
    marginBottom:'10px',
  },
};

export default CommentBox;
