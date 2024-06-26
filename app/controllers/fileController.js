const fileService = require('../services/fileService');
const { deleteFile, getFile } = require('../config/aws');


/* <------------- POST REQUESTS -------------> */
/* 
    when a user decides to view/contribute the following info will be sent along :
    - university name, 
    - department
    - course number 
    - file name (optional : default will be the name of the actual file??)
    - Content type (Practice Exam, Cheatsheet, Notes)
    */
exports.uploadFile = async (req, res, next) => { 
    // if we successfully uploaded file to s3
    if (!req.file) { 
        res.status(500).send("<h1>Failed to upload file </h1>");
        return;
    }
    // const username = req.session.username; TURNED OFF FOR EASY API DEV
    const username = "KoolKaa"
    const userID = req.session.userID;
    // const { university, department, course_number, content_type } = req.body;
    const university = "Berkeley";
    const department = "CS";
    const course_number = 162;
    const content_type = "exam";
    try { 
        await fileService.uploadFileMetadata(userID, university, department, course_number, username, content_type, req.file.originalname, req.file.size, req.file.key);
        res.status(201).send("<h1>File Uploaded Successfully!!</h1>");
    } catch (err) {
        /* IN CASE WE FAIL ON UPLOADING FILE METADATA TO MONGO, we need to rollback upload to s3!*/
        const deleteResponse = await deleteFile(req.file.key);
        console.log(deleteResponse);
        next(err);
    }    
};

exports.loadFilesMetadata = async (req, res, next) => { 
    const { university, department, course_number, content_type } = req.body;
    const page_number = req.query.page_number;
    try { 
        const files = await fileService.loadFilesMetadata(university, department, course_number, content_type, page_number);
        res.status(201).json(files);
    } catch (err) { 
        next(err);
    }
};

exports.voteFile = async (req, res, next) => { 
    const { fileid, vote } = req.body;

    
    const userID = 2;
    // const userID = req.session.userID;
    try {   
        if (vote !== "0" && vote !== "1") { 
            throw new Error("Invalid vote");
        }
        const response = await fileService.voteFile(fileid, vote, userID);
        if (response) { 
            res.status(201).send("Successfully voted for file!");
        } else { 
            res.status(201).send("cant upvote / downvote same file");
        }
        
    } catch (err) { 
        next(err);
    }
};

/* <------------- GET REQUESTS -------------> */

exports.getFileContents = async (req, res, next) => {
    const { s3key } = req.query;
    console.log(s3key);
    try { 
        const file_data = await getFile(s3key);
        res.setHeader('Content-Type', file_data.ContentType);
        res.setHeader('Content-Length', file_data.ContentLength);
        res.setHeader('ETag', file_data.ETag);
        //pipe contents of file directly to response 
        file_data.Body.pipe(res);
        // Handle errors during streaming
        file_data.Body.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).send('Error streaming file');
        });
    } catch (err) { 
        next(err);
    }
    
}
