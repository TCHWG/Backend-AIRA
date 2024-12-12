const express = require('express');
const multer = require('multer');
const evaluationController = require('../controllers/evaluationController');
const rateLimiter = require('../middleware/rateLimiterMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for direct upload

router.post('/evaluations/:userId/:musicId', rateLimiter, upload.single('file'), evaluationController.createEvaluation);
router.get('/evaluations/:userId/:musicId', rateLimiter, evaluationController.getAllEvaluations);
router.get('/evaluations/:userId', rateLimiter, evaluationController.getAllEvaluationsByUserId);



module.exports = router;
