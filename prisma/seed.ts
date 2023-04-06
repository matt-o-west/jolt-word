import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getLeaderboard().map(async (wordData) => {
      const word = await db.word.create({
        data: {
          word: wordData.word,
          votes: wordData.votes,
        },
      })

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
      votes: 500,
      id: 'b48a396c-4f92-4018-9eb9-2d0fa57d88de',
    },
    {
      word: 'code',
      votes: 400,
      id: 'c4784144-c9a7-4f20-91ff-cea4182201d8',
    },
    {
      word: 'and',
      votes: 300,
      id: '0bfd9f79-2cb8-432d-b06e-adfed0ead4f5',
    },
    {
      word: 'be',
      votes: 200,
      id: '97954a00-8172-4294-9481-25134a789ce6',
    },
    {
      word: 'happy',
      votes: 100,
      id: 'bea1b580-e5aa-49c2-8823-40174d5fd750',
    },
  ]
}
