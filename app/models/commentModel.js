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

exports.initComments = async (fileid) => { 
    try { 
        const newFileComments = new Comments({
            fileid: fileid,
            number_of_comments: 0, 
        });
        await newFileComments.save();
    } catch (err) { 
        console.log(err);
        throw err;
    }
};

exports.getCommentCount = async (fileid) => { 
    try { 
        const FileComment = await Comments.find(
            {fileid: {$eq: fileid}},
            {_id: 0, fileid: 0, comments:0},
        );
        return FileComment; //will either be an empty array or length one array with {number of comments}

    } catch (err) { 
        console.log(err);
        throw err;
    }
};