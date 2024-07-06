import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../css/fileMetadata.css';
import Upvote from './Upvote';
import Downvote from './Downvote';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare, faComment} from '@fortawesome/free-solid-svg-icons';
import CommentBox from './CommentBox';
function FileMetadata({ file, ownerRating, setOwnerRating, setCommentLoading, activeFiles, setActiveFiles, index}) {
  const [upvoteButtonClicked, setUpvoteButton] = useState(file.upvoted);
  const [downvoteButtonClicked, setDownvoteButton] = useState(file.downvoted);
  const [msg, setMsg] = useState('');
  const [fileRating, setFileRating] = useState(file.rating);
  const [commentCount, setCommentCount] = useState(0);
  const [commentButton, setCommentButton] = useState(false);
  
  
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
      setMsg(err.message);
    }
  };
  const handleViewComments = async () => {
    setCommentButton(!commentButton);
    /* toggle off comments */
    if (!commentButton) {
      activeFiles[index] = [];
      setActiveFiles(activeFiles);
      return;
    }

    if (commentCount === 0) {
      return;
    }
    setCommentLoading(true);
    try { 
      const response = await fetch(`http://localhost:8000/content/comment?fileid=${file.fileid}`, {
        method: 'GET',
        credentials: 'include',
      })
      const FileComments = await response.json();
      console.log(FileComments);
      for (let i = 0; i < activeFiles.length; i++) {
        if (i !== index) {
          activeFiles[i] = []; //clear all other file comments
        } else if (FileComments.length !== 0) {  //if there are contents
          activeFiles[i] = FileComments[0].comments
        }
      }
      setActiveFiles(activeFiles);
      // setComments(FileComments.comments); //the actual comments for the file represented as an array of comment objects
    } catch (err) {
      console.log(err.message);
    } finally { 
      setCommentLoading(false);
    }
  };

  const handleVote = async (vote) => {
    // Prevent upvoting/downvoting consecutively
    if ((vote === 1 && upvoteButtonClicked) || (vote === -1 && downvoteButtonClicked)) {
      return;
    }

    try {
      // Update button states based on vote
      if (vote === 1) {
        if (downvoteButtonClicked && setOwnerRating) {
          setOwnerRating(ownerRating + 1);
        }
        setDownvoteButton(false);
        setUpvoteButton(true);
        
      } else if (vote === -1) {
        if (upvoteButtonClicked && setOwnerRating) {
          setOwnerRating(ownerRating - 1);
        }
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
      width: '400px',
      height: '50px',
      position: 'relative',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    }}>
      {file &&
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Upvote handleVote={handleVote} upvoteButtonClicked={upvoteButtonClicked}/> 
            <Downvote handleVote={handleVote} downvoteButtonClicked={downvoteButtonClicked}/>
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
          <h5> {commentCount} Comments</h5>
          <button onClick={()=> {

            handleViewComments();
            }}>{<FontAwesomeIcon icon={faComment}/>}</button>
          <Link to={`/viewProfile/${file.ownerid}`} className="link-style"> Uploaded by {file.owner}</Link>
          {commentButton && <CommentBox fileid={file.fileid} parentid={-1} commenter_username={file.owner}/>}
        </React.Fragment>
      }
    </div>
  );
}

export default FileMetadata;
