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

        // Create a new evaluation
        const evaluation = await prisma.evaluations.create({
            data: {
                user_id: userId,
                music_id: Number(musicId),
                name: predictions[0].label,
            },
        });

        // Create mistakes for the evaluation
        for (const prediction of predictions) {
            await prisma.mistakes.create({
                data: {
                    evaluation_id: evaluation.id,
                    timestamp: prediction.window_start.toString(),
                },
            });
        }

        // Create a new user music path using the path from axios response
        await prisma.user_musics.create({
            data: {
                user_id: userId, // Directly setting user_id
                music_id: Number(musicId), // Directly setting music_id
                user_midi_path: user_midi_path,
                user_note_path: '',
            }
        });

        return {
            name: predictions[0].label,
            mistakes: predictions.map(prediction => ({
                timestamp: prediction.window_start.toString(),
            })),
        };
    } catch (error) {
        console.error("Error creating evaluation:", error);
        throw new ApiError(500, 'Failed to create evaluation');
    }
}

module.exports = {
    createEvaluation,
};
