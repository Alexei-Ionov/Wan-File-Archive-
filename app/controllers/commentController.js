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