
/* <------------- POST REQUESTS -------------> */
exports.uploadFile = async (req, res, next) => { 
    /* 
    when a user decides to contribute the following info will be sent along :
    - university name, 
    - department
    - course number 
    - Content type (Practice Exam, Cheatsheet, Notes)

    to implement: difernet file formatting... 
    */
    const {university, department, course_number, content_type, } = req.body;

}
