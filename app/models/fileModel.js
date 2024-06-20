const { Files } = require('../config/mongo');
const mongoose = require('mongoose');

const page_size = 5;
exports.uploadFileMetadata = async (university, department, course_number, username, s3key, file_name, file_size, content_type, fileID) => {
    try { 
        const fileMetadata = new Files({
            filename: file_name,
            fileid: fileID,
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

exports.loadFilesMetadata = async (university, department, course_number, content_type, page_number) => {
    try { 
        const files = await Files.find({
            university: {$eq: university},
            department: {$eq: department},
            course_number: {$eq: course_number},
            content_type: {$eq: content_type},
        })
        .sort({rating: 1})
        .skip((page_number - 1) * page_size)
        .limit(page_size)

        console.log(files);
        const check = await Files.find();
        console.log(check);
        return files;
    } catch (err) { 
        console.log(err);
        throw new Error("Error when retrieving files for viewing");
    }
};

async function voteHelper(toInsert, toRemove, session, vote, file, userID) { 
    //if user alr upvoted/downvoted this file
    try { 
        if (toInsert.includes(userID)) { 
            return;
        }
        //if user has already downvoted this file but is now upvoting or vice versa
        if (toRemove.includes(userID)) { 
            const res = await Files.updateOne(
                {fileid: fileid},
                {$pull: {toRemove:userID}}
            ).session(session)
            //if we failed to remove
            if (!res.matchedCount) { 
                throw new Error("failed to remove userID from remove array");
            }
        }
        file.rating += vote;
        await file.save({session});
        await session.commitTransaction();
        console.log("voting transaction completed!");
    } catch (err) {
        throw err;
    }
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
        if (vote) { 
            await voteHelper(file.upvote, file.downvote, session, vote, file, userID);
        } else { 
            await voteHelper(file.downvote, file.upvote, session, vote, file, userID);
        }
    } catch (err) { 
        console.log(err);
        await session.abortTransaction();
        throw err;
    } finally { 
        session.endSession();
    }
};

