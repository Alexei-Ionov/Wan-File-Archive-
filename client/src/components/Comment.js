import React, { useState, useEffect, useRef } from 'react';
import CommentBox from './CommentBox';

function Comment({ comment, level, fileid, parentid}) {
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
        <div ref={commentRef} style={{ marginBottom: `${nestedHeight}px`, marginLeft: `${level * 20}px` }}>
            <div>
                <h3>{comment.commentid}</h3>
                <h3>{comment.commenter_username}</h3>
                <p>{comment.text}</p>
                <h3>{comment.rating}</h3>
                <button onClick={toggleCommentButton}>Reply</button>
            </div>
            {commentButton && <CommentBox fileid={fileid} parentid={parentid} commenter_username={comment.commenter_username}/>}
            <br></br>
            {comment.nested_comments.length > 0 && (
                <div className="nested-comment" style={{ marginLeft: '20px' }}>
                    {comment.nested_comments.map((nested_comment) => (
                        <Comment key={nested_comment.commentid} comment={nested_comment} level={level + 1} fileid={fileid} parentid={comment.commentid}/>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Comment;
