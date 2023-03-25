import { useState, useEffect, useContext } from 'react'
import { Link } from '@remix-run/react'
import { Context } from '~/root'
import generateRandomWord from '~/utils/generateRandomWord'
import Nav from '~/components/Nav'

export default function Index() {
  const [randomWord, setRandomWord] = useState('')
  const { font, theme } = useContext(Context)

  useEffect(() => {
    const fetchRandomWord = async () => {
      const word = await generateRandomWord()
      setRandomWord(word)
    }
    fetchRandomWord()
  }, [])

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center font-${font} text-md p-2 py-8 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        Hey wordsmith, here's your word for today{' '}
        <span className='text-4xl'>🫴</span>{' '}
        {(
          <Link
            to={`/${randomWord}`}
            className='text-2xl font-bold text-purple transition-all duration-250 hover:scale-110 '
          >
            {randomWord}
          </Link>
        ) || 'sorry, we ran out of words'}
      </main>
    </>
  )
}
