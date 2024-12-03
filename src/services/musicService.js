const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../errors/apiError');

async function getAllMusic() {
  try {
    const musics = await prisma.musics.findMany({
      select: {
        id: true,
        name: true,
        author: true,
        difficulty: true,
        music_description: true,
        music_path: true,
        midi_path: true,
        note_path: true,
      },
    });

    return musics.map(music => ({
      ...music,
      id: Number(music.id),
    }));

  } catch (error) {
    console.error("Error fetching music:", error);
    throw error;
  }
}

async function getMusicById(id) {
  try {
    const music = await prisma.musics.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        author: true,
        difficulty: true,
        music_description: true,
        music_path: true,
        midi_path: true,
        note_path: true,
      },
    });

    if (!music) {
      throw ApiError.notFound(`Music with ID ${id} not found`);
    }

    return {
      ...music,
      id: Number(music.id),
    };
  } catch (error) {
    console.error("Error fetching music by ID:", error);
    throw error;
  }
}

module.exports = {
  getAllMusic,
  getMusicById
};
