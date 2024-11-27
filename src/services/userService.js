const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../errors/apiError');

async function getUserDetails(uid) {
    const user = await prisma.user.findUnique({
        where: { uid },
        select: {
            name: true,
            email: true,
            photo_url: true,
        },
    });

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    const userMusicFinishedCount = await prisma.user_musics.count({
        where: {
            user_id: uid,
            progress_state: 'COMPLETED',
        },
    });

    const userMusicInProgressCount = await prisma.user_musics.count({
        where: {
            user_id: uid,
            progress_state: 'IN_PROGRESS',
        },
    });

    return {
        name: user.name,
        email: user.email,
        photo_url: user.photo_url,
        user_music_finished: userMusicFinishedCount,
        user_music_inprogress: userMusicInProgressCount,
    };
}

async function updateUserName(uid, newName) {
    const user = await prisma.user.findUnique({
        where: { uid },
    });

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { uid },
        data: { name: newName },
    });

    return updatedUser;
}

module.exports = {
    getUserDetails,
    updateUserName,
};
