import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
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

      // Then, create a Leaderboard entry that references the created Word's id for each Word
      return db.leaderboard.create({
        data: {
          list: {
            connect: {
              id: word.id,
            },
          },
          votes: wordData.votes,
        },
      })
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
