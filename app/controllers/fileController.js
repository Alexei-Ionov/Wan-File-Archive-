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
        res.status(500).send("Failed to upload file");
        return;
    }
    const username = req.session.username; 
    const userID = req.session.userID;
    const { university, department, course_number, content_type } = req.body;
    /* first verify validity of user input*/
    try { 
        await this.verifyUniversityInputData(university, department, course_number, content_type);
    } catch (err) {
        console.log("invalid selection values");
        console.log("deleting file from s3...");
        // delete file from s3
        await deleteFile(req.file.key);
        next(err);
        return;
    }

    try { 
        await fileService.uploadFileMetadata(userID, university, department, course_number, username, content_type, req.file.originalname, req.file.size, req.file.key);
        return res.status(201).send("File Uploaded Successfully!!");
    } catch (err) {
        /* IN CASE WE FAIL ON UPLOADING FILE METADATA TO MONGO, we need to rollback upload to s3!*/
        console.log("failed to upload file metadata...");
        console.log("deleting file from s3");
        await deleteFile(req.file.key);
        next(err);
    }    
};



exports.voteFile = async (req, res, next) => { 
    const { fileid, vote } = req.body;

    
    const userID = req.session.userID;
    try {   
        if (vote !== "0" && vote !== "1") { 
            throw new Error("Invalid vote");
        }
        const response = await fileService.voteFile(fileid, vote, userID);
        if (response) { 
            res.status(201).send("Successfully voted for file!");
        } else { 
            res.status(201).send("Can't upvote / downvote same file");
        }
        
    } catch (err) { 
        next(err);
    }
};

/* <------------- GET REQUESTS -------------> */


exports.loadFilesMetadata = async (req, res, next) => { 
    const { university, department, course_number, content_type } = req.query;
    /* first verify validity of user input*/
    try { 
        await this.verifyUniversityInputData(university, department, course_number, content_type);
    } catch (err) {
        next(err);
        return;
    }
    const page_number = req.query.page_number;
    const userID = req.session.userID;
    try { 
        const files = await fileService.loadFilesMetadata(university, department, course_number, content_type, page_number, userID);
        return res.status(201).json(files);
    } catch (err) { 
        next(err);
    }
};

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
    
};

exports.verifyUniversityInputData = async (university, department, course_number, content_type) => { 
    /* validate input data ... make sure no one is writing their own js lol in their browser */
    try { 
         /* first check content type since we are not storing this in our db */

        if (content_type !== 'exam' && content_type !== 'notes' && content_type !== 'cheatsheet' && content_type !== 'outside_source') { 
            throw new Error("Invalid content type")
        }
        await fileService.verifyUniversityInputData(university, department, course_number);
    } catch (err) {
        //err alr contains err msg so we can just propograte to our error handler here
        throw err;
    }
};
