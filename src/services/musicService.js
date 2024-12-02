const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllMusic() {
  try {
    return await prisma.musics.findMany({
      select: {
        name: true,
        author: true,
        difficulty: true,
        music_description: true,
        music_path: true,
        midi_path: true,
        note_path: true
      },
    });
  } catch (error) {
    console.error("Error fetching music:", error);
    throw error;
  }
}

module.exports = { getAllMusic };