import CommentBox from './CommentBox';
import Comment from './Comment';
function CommentContainer({ comments }) {
    comments.sort((c1, c2) => c2.rating - c1.rating);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
            padding: '20px',
        }}>
            {/* <CommentBox/>
            <br></br> */}
            {comments.map((comment) => (
                <Comment key={comment.commentid} comment={comment} level={0} fileid={comments.fileid} parentid={-1}/>
            ))}
        </div>
    );
}
export default CommentContainer;