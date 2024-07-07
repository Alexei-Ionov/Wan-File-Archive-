import React, { useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import '../css/fileMetadata.css';

import Vote from './Vote'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare, faComment} from '@fortawesome/free-solid-svg-icons';
import CommentBox from './CommentBox';
import CommentContainer from './CommentContainer';

function FileMetadata({ file, ownerRating, setOwnerRating, setCommentLoading }) {
  const [upvoteButtonClicked, setUpvoteButton] = useState(file.upvoted);
  const [downvoteButtonClicked, setDownvoteButton] = useState(file.downvoted);
  const [fileRating, setFileRating] = useState(file.rating);
  const [commentCount, setCommentCount] = useState(0);
  const [commentButton, setCommentButton] = useState(false);
  const [comments, setComments] = useState([]);
  
  
  // const [commentLoading, setCommentLoading] = useState(false);
  const viewFileContents = async () => {
    try { 
      const response = await fetch(`http://localhost:8000/content/view?s3key=${file.s3key}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to fetch file contents");
      }
      const contentType = response.headers.get('Content-Type');

      if (contentType.startsWith('image')) {
          // Handle images
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          // Display image in a new tab or modal
          window.open(imageUrl, '_blank');
      } else if (contentType === 'application/pdf') {
          // Handle PDF files
          const blob = await response.blob();
          const pdfUrl = URL.createObjectURL(blob);
          console.log(pdfUrl);
          // Open PDF in a new tab or embed in iframe
          window.open(pdfUrl, '_blank');
      } else if (contentType.startsWith('text')) {
          // Handle text files
          const text = await response.text();
          const textWindow = window.open();
          textWindow.document.write(`<pre>${text}</pre>`);
          textWindow.document.close();
      } else {
          // Handle other types, such as videos, audio, etc.
          const blob = await response.blob();
          const fileUrl = URL.createObjectURL(blob);
          // Open file or handle as needed
          window.open(fileUrl, '_blank');
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  
  const handleViewComments = async () => {
    setCommentButton(!commentButton);
   

    if (commentCount === 0) {
      return;
    }
    setCommentLoading(true);
    try { 
      const response = await fetch(`http://localhost:8000/content/comment?fileid=${file.fileid}`, {
        method: 'GET',
        credentials: 'include',
      })
      /* will be an array of comment objects or [] if none are present */
      const fileComments = await response.json();
      setComments(fileComments);

    } catch (err) {
      console.log(err.message);
    } finally { 
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    const getCommentCount = async () => {
      try { 
        const response = await fetch(`http://localhost:8000/comment/count?fileid=${file.fileid}`, {
          method: 'GET', 
          credentials: 'include',
        })
        const comment = await response.json();
        //either empty array or length 1 array with comment count in it 
        if (comment.length > 1) { 
          throw new Error("Somehow got more than one comment from the fileid. Probability of this happening is nearly 0.");
        }
        if (comment.length === 1) { 
          setCommentCount(comment[0].number_of_comments);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getCommentCount();
  }, [])
  return (
    <div style={{
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      padding: '20px',
      marginBottom: '20px',
      position: 'relative',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    }}>
      {file &&
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Vote fileid={file.fileid} commentid={null} setDownvoteButton={setDownvoteButton} setUpvoteButton={setUpvoteButton} setFileRating={setFileRating} setOwnerRating={setOwnerRating} upvoteButtonClicked={upvoteButtonClicked} downvoteButtonClicked={downvoteButtonClicked} />
            <div style={{ color: 'gray', position: 'absolute', top: '20px', left: '10px' }}>{fileRating}</div>
          </div>
          {/* <h3 style={{ textAlign: 'center', margin: '0', position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }} onclick="viewFileContents()">{file.filename}</h3> */}
          <div
            style={{
                textAlign: 'center',
                margin: '0',
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                cursor: 'pointer' // Add cursor pointer for visual indication
            }} onClick={viewFileContents}>{file.filename}  {<FontAwesomeIcon icon={faUpRightFromSquare} />} 
          </div>
          <Link to={`/viewProfile/${file.ownerid}`} className="file-link-style"> Uploaded by {file.owner}</Link>
          <h5> {commentCount} Comments</h5>
          <button onClick={()=> {

            handleViewComments();
            }}>{<FontAwesomeIcon icon={faComment}/>}</button>
          {commentButton && (<CommentBox fileid={file.fileid} parentid={-1} commenter_username={file.owner} setCommentCount={setCommentCount}/>)}
          {commentButton && (<CommentContainer comments={comments} setCommentCount={setCommentCount} fileid={file.fileid}/>)}
        </div>
      }
    </div>
  );
}

export default FileMetadata;
