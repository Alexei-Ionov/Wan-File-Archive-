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

exports.addComment = async (fileid, parentid, comment, commenter_username, ownerid) => {
    try {
        await commentModel.addComment(fileid, parentid, comment, commenter_username, ownerid);
    } catch (err) {
        throw err;
    }
};

exports.voteComment = async(fileid, commentid, vote, userID) => { 
    try { 
        await commentModel.voteComment(fileid, commentid, vote, userID);
    } catch (err) {
        throw err;
    }
};