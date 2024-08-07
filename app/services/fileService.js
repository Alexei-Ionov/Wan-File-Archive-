const fileModel = require('../models/fileModel');
const { v4: uuidv4 } = require('uuid');
const commentService = require('../services/commentService');

/* TODO: roll back file model upload */
exports.uploadFileMetadata = async (userID, university, department, course_number, username, content_type, file_name, file_size, s3key) => {
    const fileid = uuidv4();
    try {         
        await fileModel.uploadFileMetadata(userID, university, department, course_number, username, s3key, file_name, file_size, content_type, fileid);
    } catch (err) {
        throw err;
    }
    try {
        await commentService.initComments(fileid);
    } catch (err) {
        await fileModel.deleteFileMetadata(fileid);
        throw err;
    }
};

exports.loadFilesMetadata = async (university, department, course_number, content_type, userID, ownerID) => {
    try {                                            
        const files = await fileModel.loadFilesMetadata(university, department, course_number, content_type, ownerID);
        let res = [];
        for (let i = 0; i < files.length; i++) { 
            const file = files[i];
            //these two below are used for determining whether the user has already previously voted for this file
            //if yes, we can highlight the upvote/downvote button!
            const upvoted = file.votes.upvotes.includes(userID) 
            const downvoted = file.votes.downvotes.includes(userID);
            res.push({
                owner: file.owner,
                ownerid: file.ownerid,
                s3key: file.s3key,
                rating: file.rating,
                filename:file.filename,
                fileid: file.fileid,
                upvoted: upvoted,
                downvoted: downvoted,
            });
        }
        return res;
    } catch (err) { 
        throw err;
    }
};


exports.voteFile = async (fileid, vote, userID) => { 
    try { 
        return await fileModel.voteFile(fileid, vote, userID);
    } catch (err) { 
        throw err;
    }
};  

exports.verifyUniversityInputData = async (university, department, course_number) => { 
    try { 
        await fileModel.verifyUniversityInputData(university, department, course_number);
    } catch (err) { 
        throw err;
    }
};