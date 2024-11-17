const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllCourses() {
  try {
    return await prisma.courses.findMany({
      select: {
        name: true,
        difficulty: true,
        course_description: true,
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

module.exports = { getAllCourses };