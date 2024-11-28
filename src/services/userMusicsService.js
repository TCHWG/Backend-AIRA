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
          name: true,
          author: true,
          difficulty: true,
        }
      },
    },
  });

  if (!userMusics || userMusics.length === 0) {
    return null;
  }

  // Mengambil detail musik dari userMusics
  return userMusics.map(userMusic => userMusic.music);
}



module.exports = {
  getUserMusicsDetails,
};
