const fileModel = require('../models/fileModel');
const { v4: uuidv4 } = require('uuid');

exports.uploadFileMetadata = async (userID, university, department, course_number, username, content_type, file_name, file_size, s3key) => {
    try { 
        // university, department, course_number, username, s3key, file_name, file_size, content_type
        const fileID = uuidv4();
        await fileModel.uploadFileMetadata(userID, university, department, course_number, username, s3key, file_name, file_size, content_type, fileID);
    } catch (err) {
        throw err;
    }
};

exports.loadFilesMetadata = async (university, department, course_number, content_type, page_number) => {
    try { 
        const files = await fileModel.loadFilesMetadata(university, department, course_number, content_type, page_number);
        let res = [];
        for (let i = 0; i < files.length; i++) { 
            const file = files[i];
            res.push({
                owner: file.owner,
                s3key: file.s3key,
                rating: file.rating,
                filename:file.filename,
                fileid: file.fileid,
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