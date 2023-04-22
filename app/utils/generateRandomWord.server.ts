import { db } from 'prisma/db.server'
// remove below client-side code, replace with loaders to server-side code

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '81c7ff456emsh15dd1877c019034p1c55acjsn3e24de972fd9',
    'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
  },
}

export async function getRandomWord() {
  const word = await fetch(
    'https://wordsapiv1.p.rapidapi.com/words/?random=true',
    options
  )
    .then((response) => response.json())
    .then((response) => response.word)
    .catch((err) => console.error(err))

  return word
}

export async function getWord(searchTerm: string) {
  const word = await fetch(
    `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=42bce219-5d4d-4186-8ab7-f8389ef2e3d0` //replace this with .env file
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((err) => console.error(err))
  return word
}

const startOfToday = new Date(new Date().setUTCHours(0, 0, 0, 0))

async function storeRandomWord(word: string) {
  const existingWord = await db.randomWord.findFirst({
    where: { createdAt: { gte: startOfToday } },
  })

  if (!existingWord) {
    await db.randomWord.create({ data: { word } })
  }
}

async function generateRandomWord(): Promise<string> {
  const existingWord = await db.randomWord.findFirst({
    where: { createdAt: { gte: startOfToday } },
  })

  if (existingWord) {
    const checkWord = await getWord(existingWord.word)
    if (checkWord && checkWord[0] && checkWord[0].meta) {
      return existingWord.word
    } else {
      await db.randomWord.delete({ where: { id: existingWord.id } })
      return generateRandomWord()
    }
  }

  const word = await getRandomWord()
  const definition = await getWord(word)

  if (definition && definition[0] && definition[0].meta) {
    // If the definition is found and it has a 'meta' property, store the word in the database
    await storeRandomWord(word)
    return word
  } else {
    // If the definition is not found or doesn't have a 'meta' property, call the function again recursively
    return generateRandomWord()
  }
}

export default generateRandomWord
