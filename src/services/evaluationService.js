const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const FormData = require('form-data');
const ApiError = require('../errors/apiError');

const prisma = new PrismaClient();

async function createEvaluation(musicId, userId, file) {
    try {
        // Prepare FormData for the prediction API
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        const response = await axios.post('https://model-aira-259729616548.asia-southeast2.run.app/predict', formData, {
            headers: formData.getHeaders(),
        });

        const { predictions, user_midi_path } = response.data;

        // Create a new user music path using the path from axios response
        const userMusic = await prisma.user_musics.create({
            data: {
                user_id: userId,
                music_id: Number(musicId),
                user_midi_path: user_midi_path,
                user_note_path: '',
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
                user_musics_id: userMusic.id, // Use the ID of the created userMusic
                name: predictions[0].label,
            },
        });

        // Create mistakes for the evaluation
        const mistakesData = predictions.map(prediction => ({
            evaluation_id: evaluation.id,
            timestamp: prediction.window_start.toString(),
        }));

        await prisma.mistakes.createMany({
            data: mistakesData,
        });

        // Prepare the response data
        return {
            date: formattedDate, // Date from createdAt in Indonesian format
            time: formattedTime, // Time from createdAt in Indonesian format
            user_midi_path: userMusic.user_midi_path,
            user_note_path: userMusic.user_note_path,
            evaluations: [{
                name: evaluation.name,
                mistakes: mistakesData.map(mistake => ({
                    timestamp: mistake.timestamp,
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
