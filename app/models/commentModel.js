const { Comments } = require('../config/mongo');

exports.viewComments = async (fileid) => { 
    try { 
        const FileComment = await Comments.find({
            fileid: {$eq: fileid},
        });
        return FileComment; //returns either [FileComment object] or []
    } catch (err) {
        console.log(err);
        throw err;
    }
};