import { useState, useEffect } from 'react'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { getRandomWord } from '~/models/dictionary.server'
import { Link } from '@remix-run/react'
import generateRandomWord from '~/utils/generateRandomWord'

type LoaderData = {
  data: Awaited<ReturnType<typeof getRandomWord>>
}
interface Word {
  word: string
  shortdef: string[]
}

export const loader: LoaderFunction = async () => {
  const data = await getRandomWord()
  return json<LoaderData>({ data })
}

export default function Index() {
  const [font, setFont] = useState('sans-serif')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [matchingWords, setMatchingWords] = useState<string[]>([])
  const [randomWord, setRandomWord] = useState('')

  useEffect(() => {
    const fetchRandomWord = async () => {
      const word = await generateRandomWord()
      setRandomWord(word)
    }
    fetchRandomWord()
  }, [])

  const updateFont = ({ target }) => {
    setFont(target.value)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(searchTerm) // here's the form submit function, can you add code needed to make it work in the context of this route file?
  }

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchTerm = event.target.value
    setSearchTerm(searchTerm)

    if (searchTerm.length > 2) {
      // not sure why, but getWord from dictionary.server.ts doesn't work here, says it is not a function even though the import looks correct
      const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=42bce219-5d4d-4186-8ab7-f8389ef2e3d0`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)

      if (Array.isArray(data) && typeof data[0] === 'string') {
        setMatchingWords(data)
        return data
      } else if (Array.isArray(data) && typeof data[0] !== 'string') {
        setMatchingWords(data[0].hwi?.hw)
        return data[0].hwi?.hw
      }
    }
  }

  const userButton = isLoggedIn ? (
    <button className='border border-none rounded-md px-2 py-1'>
      <img src='images/avatar.png' alt='avatar' className='h-8 rounded-full' />
    </button>
  ) : (
    <button
      className='bg-gray text-primary.black rounded-md px-2 py-1 ml-2 hover:bg-background'
      onClick={handleLogin}
    >
      Log In
    </button>
  )

  const themeButton = (
    <button className='rounded-md px-2 py-1 ml-2' onClick={toggleDarkMode}>
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )

  return (
    <>
      <nav
        className={`flex flex-row justify-between items-center font-${font} text-xs p-2 py-8 m-2 desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <img src='images/logo.svg' alt='logo' className='h-8 w-8 ml-1' />

        <div className='flex items-center'>
          {/* put this in a Form component */}
          <div className='flex flex-row border-r-2'>
            <select
              className='p-0.5 mr-2 pr-2 border-none outline-none select'
              aria-label='font selector'
              onChange={updateFont}
            >
              <option value='sans-serif'>Sans Serif</option>
              <option value='serif'>Serif</option>
              <option value='mono'>Mono</option>
            </select>
          </div>
          {themeButton}
          {userButton}
        </div>
      </nav>
      <form
        onSubmit={handleSearchSubmit}
        className='desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto'
      >
        <div className='flex justify-center rounded-lg bg-tertiary.gray mx-4'>
          <input
            className='flex-row w-full mx-1 py-2 border-gray px-4 bg-tertiary.gray outline-purple'
            placeholder='Search Dictionary'
            value={searchTerm}
            onChange={handleInputChange}
          />
          <div className='relative inset-y-0 right-0 flex items-center pl-2 mr-4'>
            <button type='submit'>
              <img
                src='images/icon-search.svg'
                alt='search'
                className='h-4 w-4'
              />
            </button>
          </div>
        </div>
      </form>
      {Array.isArray(matchingWords) && matchingWords.length > 2 ? (
        <div className='flex flex-col justify-center items-center text-md p-2 py-8 m-2 desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto'>
          {matchingWords
            .map((word, i) => {
              return (
                <Link
                  key={word[i]}
                  to={`/words/${word}`}
                  className='text-2xl font-bold text-purple transition-all duration-250 hover:scale-110 '
                >
                  {word}
                </Link>
              )
            })
            .slice(0, 5)}
        </div>
      ) : null}

      <div
        className={`flex flex-col justify-center items-center font-${font} text-md p-2 py-8 m-2 desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        Hey wordsmith, here's your word for today{' '}
        <span className='text-4xl'>🫴</span>{' '}
        {(
          <Link
            to='/words/$word'
            className='text-2xl font-bold text-purple transition-all duration-250 hover:scale-110 '
          >
            {randomWord}
          </Link>
        ) || 'sorry, we ran out of words'}
      </div>
    </>
  )
}
