import React, { useState, useEffect, useRef } from 'react';
import CommentBox from './CommentBox';
import '../css/comment.css';
import { Link } from 'react-router-dom';
import Upvote from './Upvote';
import Downvote from './Downvote';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare, faComment} from '@fortawesome/free-solid-svg-icons';
function Comment({ comment, level, fileid, parentid, setCommentCount }) {
    const [commentButton, setCommentButton] = useState(false);
    const [nestedHeight, setNestedHeight] = useState(0);
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
            <div>
                <Link to={`/viewProfile/${comment.ownerid}`} className="comment-link-style">{comment.commenter_username}</Link>
                <p>{comment.comment}</p>
                <h3>{comment.rating}</h3>
                <button onClick={toggleCommentButton}>Reply</button>
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
