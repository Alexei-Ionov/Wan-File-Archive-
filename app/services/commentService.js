const commentModel = require('../models/commentModel');
exports.viewComments = async (fileid) => {
    try { 
        return await commentModel.viewComments(fileid);
    } catch (err) {
        throw err;
    }
};