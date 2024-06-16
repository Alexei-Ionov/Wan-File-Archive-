const fileService = require('../services/fileService');
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
    const { university, department, course_number, content_type } = req.body;
    // const username = req.session.username; TURNED OFF FOR EASY API DEV
    const username = "KoolKaa"
    try { 
        await fileService.uploadFile(university, department, course_number, username, content_type);
        res.status(201).send("<h1>File Uploaded Successfully!!</h1>");
    } catch (err) {
        throw err;
    }    
};
