import React, { useState } from 'react';

const CommentBox = ({ fileid, parentid, commenter_username }) => {
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
   const handleSubmit = async () => { 
        try { 
            console.log(fileid);
            console.log(parentid);
            console.log(comment);
            console.log(commenter_username);
            const formData = new FormData();
            formData.append('fileid', fileid);
            formData.append('parentid', parentid);
            formData.append('commenter_username', commenter_username);
            formData.append('comment', comment);
            const response = await fetch('http://localhost:8000/content/add-comment', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const response_msg = await response.text();
            setMsg(response_msg);

        } catch (err) {
            console.log(err.message);
            return;
        }
    }

  // const handleSubmit = () => {
  //   console.log("submitted!");
  // };

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
      <h3>{msg}</h3>
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
