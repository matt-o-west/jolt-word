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
    return existingWord.word
  }

  const word = await getRandomWord()

  // Check if the word is valid by looking up its definition
  const definition = await getWord(word)

  if (definition !== undefined) {
    // If the definition is found, store the word in the database
    await storeRandomWord(word)
    return word
  } else {
    // If the definition is not found, call the function again recursively
    return generateRandomWord()
  }
}

export default generateRandomWord
