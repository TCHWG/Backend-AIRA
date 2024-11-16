const { Storage } = require('@google-cloud/storage');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Initialize Google Cloud Storage with credentials from environment variables
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME; // Use env variable or default

async function uploadPhoto(uid, file) {
    const bucket = storage.bucket(bucketName);
    const folderPath = 'profile-photos'; // Specify the folder path within the bucket

    // Extract the file extension from the original file name
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folderPath}/${uid}.${fileExtension}`; // Use uid and file extension as the file name

    try {
        // Check if a file with the same name exists and delete it
        const existingFile = bucket.file(fileName);
        const [exists] = await existingFile.exists();
        if (exists) {
            await existingFile.delete();
        }

        // Create a new blob for the file
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
                console.error('Error uploading file:', err);
                reject(new Error('Failed to upload file to Google Cloud Storage.'));
            });

            blobStream.on('finish', async () => {
                try {
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    const updatedUser = await prisma.user.update({
                        where: { uid },
                        data: { photo_url: publicUrl },
                    });
                    resolve(updatedUser);
                } catch (error) {
                    console.error('Error updating user photo URL:', error);
                    reject(new Error('Failed to update user photo URL.'));
                }
            });

            blobStream.end(file.buffer);
        });
    } catch (error) {
        console.error('Error handling file upload:', error);
        throw new Error('Failed to handle file upload.');
    }
}

module.exports = {
    uploadPhoto,
};
