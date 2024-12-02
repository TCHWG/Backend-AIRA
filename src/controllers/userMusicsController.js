const userMusicsService = require('../services/userMusicsService');
const ApiError = require('../errors/apiError');

class UserMusicsController {
  static async getUserMusics(req, res) {
    const { uid } = req.user;

    try {
      const userMusicsExists = await userMusicsService.getUserMusicsDetails(uid);

      if (!userMusicsExists || userMusicsExists.length === 0) {
        return res.status(200).json({
          success: true,
          code: 200,
          status: 'OK',
          message: 'Successfully retrieved music data for the user.',
          data: null,
        });
      }

      const musicData = userMusicsExists.map(music => ({
        name: music.name,
        author: music.author,
        difficulty: music.difficulty,
        music_path: music.music_path,
        midi_path: music.midi_path,
        note_path: music.note_path
      }));

      res.status(200).json({
        success: true,
        code: 200,
        status: 'ok',
        message: 'successfully retrieved all music played by the user.',
        data: musicData,
      });

    } catch (error) {
      console.error('Error in getMusic:', error);

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
          status: 'Internal Server Error',
          message: 'Failed to retrieve music data',
        });
      }
    }
  }
}

module.exports = UserMusicsController;