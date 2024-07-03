//we are garunteed that comments will at least have a length of 1
import Comment from './Comment';
function CommentContainer({ comments }) {
    if (comments.length === 1 && comments.nested_comments.length === 0) {
        return <Comment comment={comments[0]}/>
    }
    /* as of right now comments object has no order to it goal is to first sort it at every level before we go to render the comments */
    comments.sort((c1,c2) => c2.rating - c1.rating);
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
            padding: '20px',
        }}>
        {comments.map((comment) => (
            <CommentContainer comments = {comment.nested_comments}/>
        ))}
        </div>
  );
};
export default CommentContainer;