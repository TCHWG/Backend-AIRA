const musicService = require('../services/musicService');
const ApiError = require('../errors/apiError');

class MusicController {
  static async getMusic(req, res) {
    try {
      const music = await musicService.getAllMusic();

      if (!music || music.length === 0) {
        throw ApiError.notFound("No music available");
      }

      res.status(200).json({
        success: true,
        code: 200,
        status: "ok",
        message: "successfully retrieved all music.",
        data: music,
      });
    } catch (error) {
      console.error("Error in getMusic:", error);
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
          message: "Failed to retrieve music",
        });
      }
    }
  }

  static async getMusicDetail(req, res, next) {
    const { musicId } = req.params;

    if (!musicId) {
      return next(ApiError.badRequest('Music ID parameter is missing or invalid.'));
    }

    try {
      const music = await musicService.getMusicById(musicId);

      if (!music) {
        throw ApiError.notFound(`Music with ID ${musicId} not found`);
      }

      res.status(200).json({
        success: true,
        code: 200,
        status: "ok",
        message: `Successfully retrieved music: ${music.name}`,
        data: music,
      });
    } catch (error) {
      console.error("Error in getMusicById:", error);
      if (error instanceof ApiError) {
        return next(error);
      } else {
        return next(ApiError.internalServerError('Failed to retrieve music by ID'));
      }
    }
  }
}

module.exports = MusicController;