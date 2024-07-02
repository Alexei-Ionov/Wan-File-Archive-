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