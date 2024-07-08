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
    const [commentRating, setCommentRating] = useState(comment.rating);
    const [nestedComments, setNestedComments] = useState(comment.nested_comments);
    // comment.nested_comments.sort((c1, c2) => c2.rating - c1.rating);
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

    }, [nestedComments]);

    return (
        <div ref={commentRef} className="comment" style={{ marginBottom: `${nestedHeight}px`, marginLeft: `${level * 20}px` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Vote fileid={fileid} commentid={comment.commentid} setDownvoteButton={setDownvoteButton} setUpvoteButton={setUpvoteButton} upvoteButtonClicked={upvoteButtonClicked} downvoteButtonClicked={downvoteButtonClicked} setCommentRating={setCommentRating}/>
                <div style={{ color: 'gray', position: 'absolute', top: '20px', left: '10px' }}>{commentRating}</div>
            </div>
            <div>
                <Link to={`/viewProfile/${comment.ownerid}`} className="comment-link-style">{comment.commenter_username}</Link>
                <p>{comment.comment}</p>
                <button onClick={toggleCommentButton}>{<FontAwesomeIcon icon={faComment}/>}</button>
            </div>
            {commentButton && <CommentBox fileid={fileid} parentid={comment.commentid} setCommentCount={setCommentCount} setNestedComments={setNestedComments}/>}
            <br />
            {nestedComments.length > 0 && (
                <div className="nested-comment" style={{ marginLeft: '20px' }}>
                    {nestedComments.map((nested_comment) => (
                        <Comment key={nested_comment.commentid} comment={nested_comment} level={level + 1} fileid={fileid} parentid={comment.commentid} setCommentCount={setCommentCount}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment;
