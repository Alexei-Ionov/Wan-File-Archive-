import React, { useState } from 'react';

const CommentBox = () => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    console.log("submitted!");
  };

  return (
    <div style={styles.container}>
      <textarea
        value={comment}
        onChange={handleCommentChange}
        placeholder="Write your comment here..."
        style={styles.textarea}
      />
      <button onClick={handleSubmit} style={styles.button}>
        Submit
      </button>
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    width: '300px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  textarea: {
    width: '100%',
    height: '100px',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    resize: 'none',
  },
  button: {
    alignSelf: 'flex-end',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default CommentBox;
