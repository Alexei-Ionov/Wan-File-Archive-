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
};

exports.addComment = async (fileid, parentid, comment, commenter_username) => {
    const { v4: uuidv4 } = require('uuid');
    try {
        const commentid = uuidv4();
        await commentModel.addComment(fileid, parentid, comment, commenter_username, commentid);
    } catch (err) {
        throw err;
    }
};