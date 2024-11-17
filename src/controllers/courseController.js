const courseService = require('../services/courseService');
const ApiError = require('../errors/apiError');

class CourseController {
  static async getCourses(req, res) {
    try {
      const courses = await courseService.getAllCourses();

      if (!courses || courses.length === 0) {
        throw ApiError.notFound("No courses available");
      }

      res.status(200).json({
        success: true,
        code: 200,
        status: "ok",
        message: "successfully retrieved all courses.",
        data: courses,
      });
    } catch (error) {
      console.error("Error in getCourses:", error);
      if (error instanceof ApiError) {
        res.status(error.code).json({
          success: false,
          code: error.code,
          status: error.status,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          code: 500,
          status: "Internal Server Error",
          message: "Failed to retrieve courses",
        });
      }
    }
  }
}

module.exports = CourseController;