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
    const ownerid = req.session.userID;
    console.log(ownerid);
    try {
        if (!fileid || !parentid || !comment || !commenter_username) {
            throw new Error("Request info for comment creation was incomplete");
        }
        await commentService.addComment(fileid, parentid, comment, commenter_username, ownerid);
        return res.status(201).json({success: 1});        
    } catch (err) {
        next(err);
    }
    
};