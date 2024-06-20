const { S3Client, DeleteObject, GetObject} = require('@aws-sdk/client-s3'); // AWS SDK v3
const { Upload } = require('@aws-sdk/lib-storage'); // AWS SDK v3 for multipart uploads
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
            Bucket: AWS_S3_BUCKET_NAME,
            Key: fileKey,
        }
        const command = new DeleteObject(params);
        const response = await s3Client.send(command);
        return response;
    } catch (err) { 
        throw new Error("error deleting file from s3 : (");
    }
}

const getFile = async (fileKey) => { 
  try { 
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileKey,
    }
    const command = new (params);
    const response = await s3Client.send(command);
    return response;
  } catch (err) { 
      throw new Error("error deleting file from s3 : (");
  }
}

module.exports = {
  upload,
  deleteFile,
};


