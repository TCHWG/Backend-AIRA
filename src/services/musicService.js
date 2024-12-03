const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

module.exports = { getAllMusic };
