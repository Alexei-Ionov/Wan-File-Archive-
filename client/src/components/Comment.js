import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../components/AuthContext'; 

import CommentBox from './CommentBox';
import '../css/comment.css';
import { Link } from 'react-router-dom';
import Vote from './Vote';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment} from '@fortawesome/free-solid-svg-icons';
function Comment({ comment, level, fileid, parentid, setCommentCount }) {
    const { user } = useContext(AuthContext);
    const [commentButton, setCommentButton] = useState(false);
    const [nestedHeight, setNestedHeight] = useState(0);
    const [upvoteButtonClicked, setUpvoteButton] = useState(comment.votes.upvotes.includes(user.userID));
    const [downvoteButtonClicked, setDownvoteButton] = useState(comment.votes.downvotes.includes(user.userID));
    const commentRef = useRef(null);
    
    // Toggle reply box visibility
    const toggleCommentButton = () => {
        setCommentButton(!commentButton);
    };

    // Calculate the height of nested comments
    useEffect(() => {
        if (commentRef.current) {
            const nestedCommentHeight = Array.from(commentRef.current.querySelectorAll('.nested-comment'))
                .reduce((total, el) => total + el.offsetHeight, 0);
            setNestedHeight(nestedCommentHeight);
        }
    }, [comment.nested_comments]);

    return (
        <div ref={commentRef} className="comment" style={{ marginBottom: `${nestedHeight}px`, marginLeft: `${level * 20}px` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Vote fileid={fileid} commentid={comment.commentid} setDownvoteButton={setDownvoteButton} setUpvoteButton={setUpvoteButton} setFileRating={null} setOwnerRating={null} upvoteButtonClicked={upvoteButtonClicked} downvoteButtonClicked={downvoteButtonClicked} />
                <div style={{ color: 'gray', position: 'absolute', top: '20px', left: '10px' }}>{comment.rating}</div>
            </div>
            <div>
                <Link to={`/viewProfile/${comment.ownerid}`} className="comment-link-style">{comment.commenter_username}</Link>
                <p>{comment.comment}</p>
                <button onClick={toggleCommentButton}>{<FontAwesomeIcon icon={faComment}/>}</button>
            </div>
            {commentButton && <CommentBox fileid={fileid} parentid={parentid} commenter_username={comment.commenter_username} setCommentCount={setCommentCount}/>}
            <br />
            {comment.nested_comments.length > 0 && (
                <div className="nested-comment" style={{ marginLeft: '20px' }}>
                    {comment.nested_comments.map((nested_comment) => (
                        <Comment key={nested_comment.commentid} comment={nested_comment} level={level + 1} fileid={fileid} parentid={comment.commentid} setCommentCount={setCommentCount}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment;
