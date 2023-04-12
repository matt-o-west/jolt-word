import { useState, useEffect, useContext } from 'react'
import { Link } from '@remix-run/react'
import { Context } from '~/root'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import generateRandomWord from '~/utils/generateRandomWord'
import Nav from '~/components/Nav'
import LeaderBoard from '~/components/LeaderBoard'

import { db } from 'prisma/db.server'

export const loader = async () => {
  const leaderboard = await db.leaderboard.findMany({
    orderBy: {
      votes: 'desc',
    },
    take: 5,
    include: {
      list: true,
    },
  })

  return json(leaderboard)
}

export const action = async () => {
  //add action
  return null
}

export default function Index() {
  const [randomWord, setRandomWord] = useState('')
  const { font, theme } = useContext(Context)
  const data = useLoaderData<typeof loader>()

  console.log(data)

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
        <LeaderBoard data={data} />
      </main>
    </>
  )
}
