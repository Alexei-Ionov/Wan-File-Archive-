const fileModel = require('../models/fileModel');
/* 
uploads file to s3, and if successfull, sends metadata to fileModel which handles storing the 
file metadata into MONGODB 
*/
exports.uploadFile = async (university, department, course_number, username, content_type) => {
    const s3key = "key";
    const file_name = "my_test_file";
    const file_size = 100;
    try { 
        // university, department, course_number, username, s3key, file_name, file_size, content_type
        await fileModel.uploadFileMetadata(university, department, course_number, username, s3key, file_name, file_size, content_type);
    } catch (err) {
        throw err;
    }
};