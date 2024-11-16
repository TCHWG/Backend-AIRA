require('dotenv').config();

const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage with credentials from environment variables
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH,
});

module.exports = storage;
