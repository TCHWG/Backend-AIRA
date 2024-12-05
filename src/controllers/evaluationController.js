const evaluationService = require('../services/evaluationService');

async function createEvaluation(req, res, next) {
    const { musicId, userId } = req.params;
    const file = req.file;

    try {
        const evaluationData = await evaluationService.createEvaluation(musicId, userId, file);

        res.status(200).json({
            success: true,
            code: 200,
            status: 'ok',
            message: 'Successfully predicted mistakes',
            data: evaluationData,
        });
    } catch (error) {
        next(error);
    }
}

async function getAllEvaluations(req, res, next) {
    const { musicId, userId } = req.params;

    try {
        const evaluations = await evaluationService.getAllEvaluations(musicId, userId);

        // Group evaluations by users_musics_id
        const groupedEvaluations = evaluations.reduce((acc, evaluation) => {
            const { users_musics, mistakes, ...evaluationData } = evaluation;
            const createdAt = new Date(users_musics.createdAt);

            const formattedDate = createdAt.toLocaleDateString('en-GB');
            const formattedTime = createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

            // Find or create the users_musics entry in the accumulator
            let group = acc.find(entry => entry.users_musics.user_musics_id === users_musics.id.toString());

            if (!group) {
                group = {
                    users_musics: {
                        user_musics_id: users_musics.id.toString(),
                        music_id: users_musics.music_id.toString(),
                        user_midi_path: users_musics.user_midi_path,
                        user_note_path: users_musics.user_note_path,
                        date: formattedDate,
                        time: formattedTime,
                        music: {
                            name: users_musics.music.name,
                            author: users_musics.music.author,
                            difficulty: users_musics.music.difficulty,
                            music_description: users_musics.music.music_description,
                            music_path: users_musics.music.music_path,
                            midi_path: users_musics.music.midi_path,
                            note_path: users_musics.music.note_path,
                            preview_path: users_musics.music.preview_path
                        }
                    },
                    evaluations: []
                };

                acc.push(group);
            }

            // Add the current evaluation to the evaluations array
            group.evaluations.push({
                ...evaluationData,
                user_musics_id: evaluation.user_musics_id.toString(),
                mistakes: mistakes.map(mistake => ({
                    timestamp: mistake.timestamp
                }))
            });

            return acc;
        }, []);

        res.status(200).json({
            success: true,
            code: 200,
            status: 'ok',
            message: 'Successfully fetched evaluations',
            data: groupedEvaluations,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createEvaluation,
    getAllEvaluations,
};
