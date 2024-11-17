const express = require('express');
const CourseController = require('../controllers/courseController');

const router = express.Router();

router.get('/', CourseController.getCourses);

module.exports = router;
