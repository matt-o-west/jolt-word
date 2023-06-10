import { Link } from '@remix-run/react'
import { useNavigate } from '@remix-run/react'
import { useEffect, useState, useContext } from 'react'
import { Context } from '~/root'

const Autocomplete = ({ matchingWords, searchTerm = '' }) => {
  const [cursor, setCursor] = useState(-1)
  //const [wordsUpdated, setWordsUpdated] = useState(false)
  const { theme } = useContext(Context)
  const [uniqueWords, setUniqueWords] = useState([])
  const navigate = useNavigate()

  const cursorHoverLight = (i: number) =>
    theme === 'light' && cursor === i ? 'bg-secondary.gray w-full pl-1' : ''

  const cursorHoverDark = (i: number) =>
    theme === 'dark' && cursor === i ? 'bg-tertiary.black w-full pl-1' : ''

  useEffect(() => {
    const wordsAsStrings = matchingWords
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

    const uniqueWords = uniqueWordsAsStrings.map((string) =>
      typeof matchingWords[0] === 'string'
        ? string
        : matchingWords.find((word) => word?.hwi?.hw === string)
    )

    setUniqueWords(uniqueWords)
  }, [matchingWords, searchTerm])

  useEffect(() => {
    setCursor(0)
  }, [uniqueWords])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        // Move cursor down
        event.preventDefault()
        setCursor((oldCursor) => Math.min(oldCursor + 1, 4))
      } else if (event.key === 'ArrowUp') {
        // Move cursor up
        event.preventDefault()
        setCursor((oldCursor) => Math.max(oldCursor - 1, 0))
      } else if (event.key === 'Enter') {
        // Navigate to selected item
        event.preventDefault()
        if (cursor >= 0 && cursor < uniqueWords.length) {
          const word = uniqueWords[cursor]
          const path =
            typeof word === 'string'
              ? `/${word}`
              : `/${word.meta?.id?.replace(/:[^:]*$/, '')}`
          navigate(path)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cursor, matchingWords])

  if (typeof matchingWords === 'string') {
    // Handle case where matchingWords is a string
    console.log(`Found matching words in ${matchingWords}`)
    return (
      <Link
        to={`/words/${matchingWords}`}
        className='text-2xl font-bold text-purple transition-all duration-250 hover:scale-110 '
      >
        {matchingWords}
      </Link>
    )
  } else if (Array.isArray(matchingWords)) {
    //console.log(`Found matching words in ${uniqueWords}`)
    return (
      <div
        className={`flex flex-col justify-start text-md p-2 m-2 rounded-sm ${
          theme === 'light' ? 'bg-tertiary.gray' : 'bg-secondary.black'
        } ${
          !searchTerm ? 'hidden' : ''
        } desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto w-full ml-4`}
        tabIndex={0}
      >
        {uniqueWords
          .map((word, i) => {
            if (typeof word === 'string') {
              return (
                <Link
                  key={word}
                  to={`/${word}`}
                  className={`text-lg font-bold text-purple transition-all duration-250 ml-2 ${cursorHoverLight(
                    i
                  )} ${cursorHoverDark(i)}`}
                >
                  {word}
                </Link>
              )
            } else if (typeof word === 'object' && word.hwi?.hw) {
              return (
                <Link
                  key={word.meta?.uuid}
                  to={`/${word.meta?.id?.replace(/:[^:]*$/, '')}`}
                  className={`text-lg font-bold text-purple transition-all duration-250 ${cursorHoverLight(
                    i
                  )} ${cursorHoverDark(i)}`}
                >
                  {word.meta?.id?.replace(/:[^:]*$/, '')}
                </Link>
              )
            } else {
              return null // Don't render duplicate word
            }
          })
          .slice(0, 5)}
      </div>
    )
  } else {
    // Handle case where matchingWords is not a string or an array
    return null
  }
}

export default Autocomplete
