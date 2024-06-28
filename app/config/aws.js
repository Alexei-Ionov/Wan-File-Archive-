const { S3Client, DeleteObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3'); // AWS SDK v3
const multer = require('multer');
const multerS3 = require('multer-s3');


// Load environment variables from .env file
require('dotenv').config();

// Configure AWS SDK with credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Set up multer with S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname); // Use a unique filename
    },
  }),
});


const deleteFile = async (fileKey) => {
    try { 
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
        }
        const command = new DeleteObjectCommand(params);
        const response = await s3Client.send(command);
        return response;
    } catch (err) { 
        console.error("Error deleting file from S3:", err);
        throw new Error("error deleting file from s3");
    }
}

const getFile = async (fileKey) => { 
  try { 
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    }
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);
    return response;
  } catch (err) { 
      console.log(err.message);
      throw new Error("error getting file from s3");
  }
}

module.exports = {
  upload,
  deleteFile,
  getFile,
};


