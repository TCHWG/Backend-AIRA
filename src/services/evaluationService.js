const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const FormData = require('form-data');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const ApiError = require('../errors/apiError');

const prisma = new PrismaClient();

// Initialize Google Cloud Storage with credentials from environment variables
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

async function createEvaluation(musicId, userId, file) {
    try {
        // Retrieve the reference file path from the Musics table
        const music = await prisma.musics.findUnique({
            where: {
                id: Number(musicId),
            },
            select: {
                midi_path: true,
            },
        });

        if (!music) {
            throw new ApiError(404, 'Music not found');
        }

        console.log('Reference file path:', music.midi_path);

        // Download the reference file
        const referenceFileResponse = await axios.get(music.midi_path, {
            responseType: 'arraybuffer'
        });

        const referenceFileBuffer = Buffer.from(referenceFileResponse.data);
        console.log('Reference file downloaded');

        // Upload the user's audio file to Google Cloud Storage
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const fileName = path.basename(file.originalname, path.extname(file.originalname)).replace(/\s+/g, '_');
        const destination = `output_record/${timestamp}/${fileName}${path.extname(file.originalname)}`;

        const blob = storage.bucket(bucketName).file(destination);
        await blob.save(file.buffer, {
            contentType: file.mimetype,
        });

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
        console.log('Uploaded audio file URL:', publicUrl);

        // Prepare FormData for the prediction API
        const formData = new FormData();
        formData.append('audio_file', file.buffer, file.originalname);
        formData.append('reference_file', referenceFileBuffer, 'reference.mid');

        // Log the headers for debugging
        console.log('FormData headers:', formData.getHeaders());

        const response = await axios.post('https://model-aira-259729616548.asia-southeast2.run.app/v2/predict', formData, {
            headers: formData.getHeaders(),
        });

        const { predictions, user_midi_path } = response.data;

        // Create a new user music path using the path from axios response
        const userMusic = await prisma.user_musics.create({
            data: {
                user_id: userId,
                music_id: Number(musicId),
                user_midi_path: user_midi_path,
                user_record_path: publicUrl,
            }
        });

        // Extract createdAt timestamp
        const createdAt = userMusic.createdAt;

        // Format date and time for Indonesian time zone with 4-digit year
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Jakarta' };
        const timeOptions = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedDate = new Intl.DateTimeFormat('id-ID', dateOptions).format(createdAt);
        const formattedTime = new Intl.DateTimeFormat('id-ID', timeOptions).format(createdAt);

        // Create a new evaluation
        const evaluation = await prisma.evaluations.create({
            data: {
                user_musics_id: userMusic.id,
                name: predictions.mistake,
                description: predictions.description,
                confidence: parseFloat(predictions.confidence.toFixed(2)),
            },
        });

        // Create mistakes for the evaluation
        const mistakesData = predictions.timestamp.map(item => ({
            evaluation_id: evaluation.id,
            note_index: item.note_index.toString(),
            additional_description: item.additional_description,
        }));

        await prisma.mistakes.createMany({
            data: mistakesData,
        });

        // Prepare the response data
        return {
            date: formattedDate,
            time: formattedTime,
            user_midi_path: userMusic.user_midi_path,
            user_record_path: userMusic.user_record_path,
            evaluations: [{
                name: evaluation.name,
                description: evaluation.description,
                confidence: evaluation.confidence,
                mistakes: mistakesData.map(mistake => ({
                    note_index: mistake.note_index,
                    additional_description: mistake.additional_description,
                })),
            }]
        };
    } catch (error) {
        console.error("Error creating evaluation:", error);
        throw new ApiError(500, 'Failed to create evaluation');
    }
}


async function getAllEvaluations(musicId, userId) {
    return await prisma.evaluations.findMany({
        where: {
            users_musics: {
                user_id: userId,
                music_id: Number(musicId),
            },
        },
        include: {
            mistakes: true,
            users_musics: {
                include: {
                    user: true,
                    music: true,
                },
            },
        },
    });
}

module.exports = {
    createEvaluation,
    getAllEvaluations,
};
