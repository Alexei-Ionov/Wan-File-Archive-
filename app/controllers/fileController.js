const fileService = require('../services/fileService');
const { deleteFile } = require('../config/aws');
/* <------------- POST REQUESTS -------------> */
exports.uploadFile = async (req, res, next) => { 
    /* 
    when a user decides to contribute the following info will be sent along :
    - university name, 
    - department
    - course number 
    - file name (optional : default will be the name of the actual file??)
    - Content type (Practice Exam, Cheatsheet, Notes)
    */
    // if we successfully uploaded file to s3
    if (!req.file) { 
        res.status(500).send("<h1>Failed to upload file </h1>");
        return;
    }
    // const username = req.session.username; TURNED OFF FOR EASY API DEV
    const username = "KoolKaa"
    const { university, department, course_number, content_type } = req.body;
    try { 
        await fileService.uploadFileMetadata(university, department, course_number, username, content_type);
        res.status(201).send("<h1>File Uploaded Successfully!!</h1>");
    } catch (err) {
        /* IN CASE WE FAIL ON UPLOADING FILE METADATA TO MONGO, we need to rollback upload to s3!*/
        const deleteResponse = await deleteFile(req.file.key);
        console.log(deleteResponse);
        throw err;
    }    
};


/* <------------- GET REQUESTS -------------> */

exports.contributePage = async (req, res, next) => { 
    res.render('contribute');
}