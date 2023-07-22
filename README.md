# JoltWord

## Description

JoltWord is a community-driven dictionary application built with Remix, Tailwind, Material UI, and SQLite. It allows users to search for their favorite words, view detailed word information, vote for words, and even discover a new word every day!

## Features

### Word Search and Detailed View

Users can search for any word and view its detailed information on a dedicated page. We parse the API data using regex to format the tokens into a more readable format. The word details are server-side rendered for performance and SEO benefits.

### Autocomplete Search Bar

An autocomplete search bar displays parsed data fetched in real-time client-side. Users can navigate the autocomplete results using both arrow keys and their mouse which will route them to the selected word's page. Here is one of the functions that parses the API data:

```js
// Autocomplete component
useEffect(() => {
  const wordsAsStrings = matchingWords // matchingWords is passed as prop to the Autocomplete component
    .map((word: unknown) => (typeof word === 'string' ? word : word?.hwi?.hw))
    .filter((word: string) => !word.includes('*'))

  const wordsAsStringsSorted = wordsAsStrings.sort((a, b) => {
    // Special case for exact match
    if (a.toLowerCase() === searchTerm.toLowerCase()) {
      return -1
    } else if (b.toLowerCase() === searchTerm.toLowerCase()) {
      return 1
    }
    // Then, prioritize words that contain the search term as a subset
    else if (a.includes(searchTerm) && !b.includes(searchTerm)) {
      return -1
    } else if (b.includes(searchTerm) && !a.includes(searchTerm)) {
      return 1
    }
    // Then, words starting with the search term, shorter words first
    else if (a.startsWith(searchTerm) && b.startsWith(searchTerm)) {
      return a.length - b.length
    } else if (a.startsWith(searchTerm)) {
      return -1
    } else if (b.startsWith(searchTerm)) {
      return 1
    }
    // Finally, sort remaining words by length, then alphabetically
    else {
      return a.length - b.length || a.localeCompare(b)
    }
  })

  const uniqueWordsAsStrings = Array.from(new Set(wordsAsStringsSorted))

  const localUniqueWords = uniqueWordsAsStrings.map((string) =>
    typeof matchingWords[0] === 'string'
      ? string
      : matchingWords.find((word) => word?.hwi?.hw === string)
  )

  setUniqueWords(localUniqueWords)
}, [matchingWords])
```

### Random Word of the Day

A random word is picked every day and displayed on the landing page. This is achieved through server-side functions that run daily to 1. generate a random word and 2. verify that the word exists in the merriam-webster dictionary api. Once verified, the word is stored in the app's SQLite database. Here is a function that generates the word of the day:

```js
// Used in a generateRandomWord.server.ts file
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
```

### Word Voting System

Users can vote for their favorite words. The votes are tracked and saved in the user's profile. We also implemented a local storage hook to limit the number of votes a word can receive in a session.

### Authentication and User Management

Our hand-rolled authentication system allows users to create accounts, log in, and manage their profiles. We used Remix's loader and action models to handle requests and server-side operations.

### Google Sign-in

Users can sign in using their Google accounts. This feature utilizes a login-uri approach that verifies the Google token at an `/auth` route. If the token is valid, the user gets authorized to use their Google account on JoltWord.

## Additional Features

While these aren't the main functionalities, they still contribute to the user experience:

1. **Dark/Light Mode:** Users can switch between dark and light themes based on their preferences.
2. **Dropdown Menus and UI Interactions:** We have designed the UI to be interactive and easy-to-use.

## Future Improvements

We are always working to improve JoltWord and add new features. If you have any suggestions or feedback, feel free to open an issue or a pull request.
