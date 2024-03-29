//no api key required

export async function getWord(searchTerm: string) {
  const word = await fetch(
    `https://dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=42bce219-5d4d-4186-8ab7-f8389ef2e3d0`
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((err) => console.error(err))
  return word
}

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
