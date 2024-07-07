import Upvote from './Upvote';
import Downvote from './Downvote';

function Vote({fileid, commentid, setDownvoteButton, setUpvoteButton, setFileRating, setOwnerRating, upvoteButtonClicked, downvoteButtonClicked}) {
    const handleVote = async (vote) => {
        // Prevent upvoting/downvoting consecutively
        if ((vote === 1 && upvoteButtonClicked) || (vote === -1 && downvoteButtonClicked)) {
            return;
        }
        try {
            // Update button states based on vote
            if (vote === 1) {
                if (downvoteButtonClicked) {
                    if (setOwnerRating) {
                        setOwnerRating(prev => prev + 1);
                    }
                    if (setFileRating) {
                        setFileRating(prev => prev + 1);
                    }
                }
                setDownvoteButton(false);
                setUpvoteButton(true);
                
            } else if (vote === -1) {
                if (upvoteButtonClicked) {
                    if (setOwnerRating) {
                        setOwnerRating(prev => prev - 1);
                    }
                    if (setFileRating) {
                        setFileRating(prev => prev - 1);
                    }
                }
                setDownvoteButton(true);
                setUpvoteButton(false);
            }

            // Update ratings if this is for a file vote
            if (setFileRating) {
               setFileRating(prev => prev + vote);
            }

            // Update owner rating if applicable
            if (setOwnerRating) {
                setOwnerRating(prev => prev + vote);
            }

            // Send vote request to server
            const reqVote = vote === -1 ? '-1' : '1';
            let response;
            //voting on a comment
            if (commentid) {
                response = await fetch('http://localhost:8000/comment/vote', {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({fileid: fileid, commentid: commentid, vote: reqVote }),
                    credentials: 'include',
                });
            } else { //voting on a file
                response = await fetch('http://localhost:8000/content/vote', {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({ fileid: fileid, vote: reqVote }),
                    credentials: 'include',
                });
            }
            if (!response.ok) {
                throw new Error("Failed to vote");
            }
        } catch (err) {
        console.error(err.message);
        }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Upvote handleVote={handleVote} upvoteButtonClicked={upvoteButtonClicked}/> 
            <Downvote handleVote={handleVote} downvoteButtonClicked={downvoteButtonClicked}/>
        </div>
    );

};

export default Vote;