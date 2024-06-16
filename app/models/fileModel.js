const { Files } = require('../config/mongo');

exports.uploadFileMetadata = async (university, department, course_number, username, s3key, file_name, file_size, content_type) => {
    try { 
        const fileMetadata = new Files({
            filename: file_name,
            size: file_size,
            rating: 0, // Initial rating
            owner: username, 
            s3key: s3key,
            university: university, 
            department: department,
            course_number: course_number,
            content_type: content_type,
        });
        await fileMetadata.save();
    } catch (err) {
        throw err;
    }
};

