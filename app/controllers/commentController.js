const commentService = require('../services/commentService');
exports.viewComments = async (req, res, next) => { 
    const { fileid } = req.query;
    try { 
        const fileComments = await commentService.viewComments(fileid);
        return res.status(201).json(fileComments);
    } catch (err) {
        next(err);
    }
};  

exports.getCommentCount = async (req, res, next) => {
    const { fileid } = req.query;
    try { 
        const comment_count = await commentService.getCommentComment(fileid);
        return res.status(200).json(comment_count);
    } catch (err) {
        next(err);
    }
};

exports.addComment = async (req, res, next) => { 
    const {fileid, parentid, comment, commenter_username} = req.body;
    console.log(fileid);
    console.log(parentid);
    console.log(comment);
    console.log(commenter_username);
    
    const ownerid = req.session.userID;
    try {
        if (!fileid || !parentid || !comment || !commenter_username) {
            throw new Error("Request info for comment creation was incomplete");
        }
        const new_comment = await commentService.addComment(fileid, parentid, comment, commenter_username, ownerid);
        return res.status(201).json(new_comment);        
    } catch (err) {
        next(err);
    }
    
};

exports.voteComment = async (req, res, next) =>  {
    const {fileid, commentid, vote} = req.body;
    const userID = req.session.userID;
    try { 
        if (!commentid || !vote || !fileid) {
            throw new Error("Improper inputs for voting on comment");
        }
        if (vote !== "-1" && vote !== "1") {
            throw new Error("Invalid vote. Must be -1 or 1");
        }
        await commentService.voteComment(fileid, commentid, vote, userID);
    } catch (err) {
        next(err);
    }
};