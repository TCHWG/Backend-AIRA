const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserMusicsDetails(uid) {
  const userMusics = await prisma.user_musics.findMany({
    where: {
      user_id: uid,
    },
    include: {
      music: {
        select: {
          id: true,
          name: true,
          author: true,
          difficulty: true,
          music_path: true,
          midi_path: true,
          note_path: true
        }
      },
    },
  });

  if (!userMusics || userMusics.length === 0) {
    return null;
  }

  // Mengambil detail musik dari userMusics
  return userMusics.map(userMusic => ({
    music: userMusic.music,
    user_midi_path: userMusic.user_midi_path,
    user_note_path: userMusic.user_note_path
  }));
}



module.exports = {
  getUserMusicsDetails,
};
