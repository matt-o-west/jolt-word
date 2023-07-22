# JoltWord

## Description

JoltWord is a community-driven dictionary application built with Remix, Tailwind, Material UI, and SQLite. It allows users to search for their favorite words, view detailed word information, vote for words, and discover new words everyday! The ultimate vision for JoltWord is to be a social platform for word lovers to share their favorite words and learn new ones.

## Features

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

Users can vote for their favorite words. The votes are tracked and saved in the user's profile. A local storage hook limits the number of votes a word can receive in a session from a user.

### Authentication and User Management

Our hand-rolled authentication system allows users to create accounts, log in, and manage their profiles. We used Remix's loader and action models to handle requests and server-side operations.

```js
// Login route
export const action = async ({ request }: ActionArgs) => {
  // ... code
  if (
    typeof user !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    // ... error handling

    const loggedInUser = await login({ username: user, password })

    if (!loggedInUser) {
      return badRequest({
        fieldErrors: null,
        fields: null,
        formError: {
          message: 'Incorrect username or password.',
          timestamp: Date.now().toString(),
        },
      })
    }

    const userExists = await db.user.findUnique({
      where: {
        username: user,
      },
    })

    if (!userExists) {
      return badRequest({
        fieldErrors: null,
        fields: null,
        formError: {
          message: 'This user does not exist.',
          timestamp: Date.now().toString(),
        },
      })
    }
    // createUserSession is a function that creates a session cookie, exported from the session.server.ts file
    return createUserSession(loggedInUser.id, redirectTo)
  }
}
```

### Word Search and Detailed View

Users can search for any word and view its definitions on a dynamically-routed, dedicated page. Returned API data is parsed using regex to format the tokens into a more readable format. The word details are server-side rendered for performance and SEO benefits.

```js
const replaceTokens = (text: string) => {
  // ... code
  // Section of function that parses the API data and format tokens
  const crossRefTokens = reactStringReplace(
    linkTokens,
    /\{dx_ety\}see\s+\{dxt\|([^|]+)\|\|\}\{\/dx_ety\}/g,
    (match, i) => (
      <>
        {' '}
        see
        <Link
          to={`/${match.replace(/:\d+$/, '')}`}
          className='text-lowercase link'
          key={i}
        >
          {match.replace(/:\d+$/, '')}
        </Link>
      </>
    )
  )

  const wiTokens = reactStringReplace(
    crossRefTokens,
    /\{wi\}(.*?)\{\/wi\}/g,
    (match, i) => (
      <span className='italic font-lg' key={i}>
        {match}
      </span>
    )
  )

  // ... code
}
```

### Google Sign-in

Users can sign in using their Google accounts. This feature utilizes a login-uri approach that verifies the Google token at an `/auth` route. If the token is valid, the user is authorized to use their Google account. Here is what the action looks like at the route:

```js
// Auth route
export const action = async ({ request }: ActionArgs) => {
  // ... code
  let user: GoogleUser | undefined = undefined
  if (hasGoogleCookie(request)) {
    console.log('Cookie exists, calling verify')
    user = await verify(request)
    console.log(user)
    const existingUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!existingUser) {
      const newUser = await db.user.create({
        data: {
          id: user.id,
          username: user.given_name ?? user.email,
        },
      })
      return createUserSession(newUser.id, redirectTo)
    }

    return createUserSession(user.id, redirectTo)
  }

  return redirect('/login?googleFailure=true')
}
```

## Additional Features

While these aren't the main functionalities, they still contribute to the user experience:

1. **Dark/Light Mode:** Users can switch between dark and light themes based on their preferences. Utilized via context and local storage to store user preference.
2. **Dropdown Menus and UI Interactions:** We have designed the UI to be interactive and easy-to-use.

## Future Improvements

1. **Occasional Bugs in Parsing of API Tokens:** There are edge cases still where certain structures of the API tokens means they are not parsed correctly, although this is more seldom than not it can lead to strange interactions once and awhile.
2. **AI Suggestions:** We would like to add a feature where users can interact with OpenAI or another API to prompt example sentences with the word of the day, matching a selected mood, tone, genre or in the style of famous writers.
3. **Mood Words or Phrases for Users:** Add a selection of mood words for users to choose from to describe them on the given day, via their profile, or compose a sentence.
4. **Social Feed and Friend Connections:** The previous feature could tie into larger social features and a social feed, where users can see what other users/friends are feeling and how they are using the word of the day.
5. **Word of the Day Archive:** We would like to create an archive of past words of the day.
6. **Word of the Day Email:** We would like to send users an email with the word of the day.
7. **Rate-Limiting and Spam Prevention:** Add rate-limiting and spam prevention to the word voting system. This is a demo app so did not implement this feature prior to gathering feedback, but it would be necessary for a production app.
