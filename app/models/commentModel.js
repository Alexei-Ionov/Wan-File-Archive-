const mongoose = require('mongoose');
const { Comments } = require('../config/mongo');

exports.viewComments = async (fileid) => { 
    try { 
        const FileComment = await Comments.findOne({
            fileid: {$eq: fileid},
        });
        return FileComment ? FileComment.comments : []
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
            {_id: 0, fileid: 0, comments:0, ownerid:0},
        );
        return FileComment; //will either be an empty array or length one array with {number of comments}

    } catch (err) { 
        console.log(err);
        throw err;
    }
};
async function addNestedComment(comments, parentid, newComment) {
    for (let comment of comments) {
        if (comment.commentid === parentid) {
            comment.nested_comments.push(newComment);
            return true;
        }
        if (await addNestedComment(comment.nested_comments, parentid, newComment)) {
            return true;
        }
    }
    return false;
};
exports.addComment = async (fileid, parentid, comment, commenter_username, ownerid) => {    
    const newComment = {
        comment: comment,
        ownerid: ownerid,
        commentid: new mongoose.Types.ObjectId(),
        rating: 0,
        commenter_username: commenter_username, 
        votes: {
            upvotes: 0, 
            downvotes: 0
        },
        nested_comments: [],
    };
    try { 
        const file = await Comments.findOne({
            fileid: {$eq: fileid},
        })
        //top level commment
        if (parentid === -1) {
            file.comments.push(newComment);
        } else {
            
            if (!file) {
                throw new Error("File not found when adding comment");
            }
            const found = await addNestedComment(file.comments, parentid, newComment);
            if (!found) {
                throw new Error("Failed to add new comment");
            }
        }
        file.number_of_comments += 1;
        await file.save();
    } catch (err) {
        throw err;
    }
}