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

module.exports = {
    createEvaluation,
};
