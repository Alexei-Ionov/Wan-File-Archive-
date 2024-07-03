const commentModel = require('../models/commentModel');
exports.viewComments = async (fileid) => {
    try { 
        return await commentModel.viewComments(fileid);
    } catch (err) {
        throw err;
    }
};

exports.initComments = async (fileid) => { 
    try { 
        await commentModel.initComments(fileid);
    } catch (err) {
        throw err;
    }
};

exports.getCommentComment = async (fileid) => { 
    try { 
        return await commentModel.getCommentCount(fileid);
    } catch (err) {
        throw err;
    }
}