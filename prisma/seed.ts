import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getLeaderboard().map(async (wordData) => {
      // First, create a Word entry for each Word in the initial list
      const word = await db.word.create({
        data: {
          word: wordData.word,
          votes: wordData.votes,
        },
      })
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
      word: 'write',
      votes: 5,
      id: 'b48a396c-4f92-4018-9eb9-2d0fa57d88de',
    },
    {
      word: 'code',
      votes: 4,
      id: 'c4784144-c9a7-4f20-91ff-cea4182201d8',
    },
    {
      word: 'and',
      votes: 3,
      id: '0bfd9f79-2cb8-432d-b06e-adfed0ead4f5',
    },
    {
      word: 'be',
      votes: 2,
      id: '97954a00-8172-4294-9481-25134a789ce6',
    },
    {
      word: 'happy',
      votes: 1,
      id: 'bea1b580-e5aa-49c2-8823-40174d5fd750',
    },
  ]
}
