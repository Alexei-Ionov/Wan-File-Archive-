import CommentBox from './CommentBox';
/*
each comment will have the following things: 
1.) fileid    --> allows us to find the file which this comment belongs to
2.) commentid --> allows for nested comments, id 
3.) profile pic top left
4.) username 
5.) ranking for the comment + upvote/downvote button
*/
function Comment({ comment }) {
    return (
        <div>
            <CommentBox/>
            <h3>{comment.commentid}</h3>
            <h3>{comment.commenter_username}</h3>
            <h3>{comment.ranking}</h3>
        </div>
    );

};
export default Comment;