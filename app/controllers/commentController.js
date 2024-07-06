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
    try {
        if (!fileid || !parentid || !comment || !commenter_username) {
            throw new Error("Request info for comment creation was incomplete");
        }
        await commentService.addComment(fileid, parentid, comment, commenter_username);
        return res.status(201).send("Comment added successfully!");        
    } catch (err) {
        next(err);
    }
    
};