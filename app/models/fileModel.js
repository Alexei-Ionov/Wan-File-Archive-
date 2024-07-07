const { Files, Universities } = require('../config/mongo');
const mongoose = require('mongoose');
const userModel = require('./userModel');
const maxLoadSize = 100;
exports.uploadFileMetadata = async (userID, university, department, course_number, username, s3key, file_name, file_size, content_type, fileID) => {
    try { 
        const fileMetadata = new Files({
            filename: file_name,
            fileid: fileID,
            size: file_size,
            rating: 0, // Initial rating
            owner: username, 
            ownerid: userID,
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
exports.loadFilesMetadata = async (university, department, course_number, content_type, ownerID) => {
    
    try { 
        /* if we are searching for files by a specific user */
        let files;
        if (ownerID) {
            files = await Files.find({
                ownerid: {$eq: ownerID},
            })
            .sort({rating: -1})
            .limit(maxLoadSize)
        } else {  //searching from the contents page 
            files = await Files.find({
                university: {$eq: university},
                department: {$eq: department},
                course_number: {$eq: course_number},
                content_type: {$eq: content_type},
            })
            .sort({rating: -1})
            .limit(maxLoadSize)
        }
        return files;
    } catch (err) { 
        console.log(err);
        throw new Error("Error when retrieving files for viewing");
    }
};

async function downvoteFile(file, session, userID) { 
    if (file.votes.downvotes.includes(userID)) { 
        console.log("userID already in downvotes array");
        return false;
    }
    if (file.votes.upvotes.includes(userID)) { 
        let res = await Files.updateOne(
                {fileid: file.fileid},
                {$pull: {"votes.upvotes":userID}}
        ).session(session)
            
        //if we failed to remove
        if (!res.matchedCount) { 
            throw new Error("failed to remove userID from upvotes array while downvoting");
        }
        //accounting for taking this users vote from upvotes
        file.rating -=1; 
    }
    const res = await Files.updateOne(
        {"fileid": file.fileid},
        {$addToSet: {"votes.downvotes": userID}}
    ).session(session);
        
    if (!res.matchedCount) { 
        throw new Error("Failed to add userID to downvotes array");
    }
    file.rating -= 1;
    return true;
}


async function upvoteFile(file, session, userID) { 
    if (file.votes.upvotes.includes(userID)) { 
        console.log("userID already in upvotes array");
        return false;
    }
    if (file.votes.downvotes.includes(userID)) { 
        let res = await Files.updateOne(
                {fileid: file.fileid},
                {$pull: {"votes.downvotes":userID}}
        ).session(session)
            
        //if we failed to remove
        if (!res.matchedCount) { 
            throw new Error("failed to remove userID from downvotes array while upvoting");
        }
        //accounting for taking this users vote out from downvotes
        file.rating += 1;
    }
    const res = await Files.updateOne(
        {"fileid": file.fileid},
        {$addToSet: {"votes.upvotes": userID}}
    ).session(session);
        
    if (!res.matchedCount) { 
        throw new Error("Failed to add userID to upvotes array");
    }
    file.rating += 1;
    return true;
}

exports.voteFile = async (fileid, vote, userID) => { 
    /* 
    vote = 1 --> upvote
    vote = 0 --> downvote
    */
    const session = await mongoose.startSession();
    session.startTransaction();
    try { 
        
        const file = await Files.find({
            fileid: {$eq: fileid}
        }).session(session);

        if (!file) { 
            throw new Error("File not found.");
        }
        //file is a one element array with our file object inside of it.
        const file_object = file[0];
        let res;
        if (vote === "1") { 
            res = await upvoteFile(file_object, session, userID);
        } else { 
            res = await downvoteFile(file_object, session, userID);
        }
        //if vote isn't valid (can't upvote if alr upvoted & can't downvote if alr downvoted)
        if (!res) {
            console.log("aborting voting transaction. can't up/down vote same file");
            await session.abortTransaction();
            return false;
        }
         /* at this point i also need to update the owner's rating as well! */
        const ownerID = file_object.ownerid;
        const rowCount = await userModel.updateUserRating(ownerID, vote);
        if (!rowCount) { 
            throw new Error("failed to update owner's rating on file upvote/downvote.");
        }
        //save the updates to the file object (rating) to mongo
        await file_object.save({session});

        console.log("changed user rating");
        await session.commitTransaction();
        console.log("voting transaction completed!");
        return true;
    } catch (err) { 
        console.log("aborting voting transaction");
        await session.abortTransaction();
        throw err;
    } finally { 
        session.endSession();
    }
};
exports.verifyUniversityInputData = async (university, department, course_number) => { 
    try { 
        const exists = await Universities.findOne({
            university: university,
            'departments.departmentName': department,
            'departments.classes.course_number': course_number
        });
        
        if (!exists) {
            throw new Error(`${university} ${department} ${course_number} does not exist in our database`);
        }
    } catch (err) { 
        console.error('Error:', err);
        throw err;
    }
};

exports.deleteFileMetadata = async (fileid) => { 
    try {
        await Files.deleteOne({
            fileid: {$eq: fileid},
        });
    } catch (err) {
        throw err;
    }
}