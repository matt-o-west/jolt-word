import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  const demoUser = await db.user.create({
    data: {
      username: 'test-user',
      passwordHash: 'test-password',
    },
  })

  await Promise.all(
    getLeaderboard().map(async (wordData) => {
      // First, check if the Word entry already exists in the database
      let word = await db.word.findUnique({
        where: {
          id: wordData.name,
        },
      })

      // If the Word entry doesn't exist, create it
      if (!word) {
        word = await db.word.create({
          data: {
            word: wordData.name,
            votes: wordData.votes,
          },
        })
      }

      return null
    })
  )
}

seed()

function getLeaderboard() {
  return [
    {
      name: 'write',
      votes: 5,
    },
    {
      name: 'code',
      votes: 4,
    },
    {
      name: 'and',
      votes: 3,
    },
    {
      name: 'be',
      votes: 2,
    },
    {
      name: 'happy',
      votes: 1,
    },
  ]
}
