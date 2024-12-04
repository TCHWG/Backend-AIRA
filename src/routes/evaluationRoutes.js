const express = require('express');
const multer = require('multer');
const evaluationController = require('../controllers/evaluationController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for direct upload

router.post('/evaluations/:musicId/:userId', upload.single('file'), evaluationController.createEvaluation);

module.exports = router;
