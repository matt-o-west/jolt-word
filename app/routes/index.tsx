import { useState, useEffect, useContext } from 'react'
import { Link, Form } from '@remix-run/react'
import { Context } from '~/root'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { ActionArgs } from '@remix-run/node'
import generateRandomWord from '~/utils/generateRandomWord'
import Nav from '~/components/Nav'
import LeaderBoard from '~/components/LeaderBoard'
import ClickableIcon from '~/components/BoltIcon'
import type { LeaderBoardType } from '~/components/LeaderBoard'

import { db } from 'prisma/db.server'

export const loader = async () => {
  const leaderboard = await db.word.findMany({
    orderBy: {
      votes: 'desc',
    },
    take: 5,
  })

  return json(leaderboard)
}

export const action = async ({ request }: ActionArgs) => {
  // Get the request body as a FormData object
  const formData = await request.formData()

  // Access the word from the request body
  const word = formData.get('word')

  // Try to find the existing word
  const existingWord = await db.word.findUnique({
    where: {
      word: word,
    },
  })

  if (existingWord) {
    // If the word exists, update its vote count
    const updatedVote = await db.word.update({
      where: {
        word: word,
      },
      data: {
        votes: {
          increment: 1,
        },
      },
    })
    console.log(updatedVote)
  } else {
    // If the word doesn't exist, create a new record with a single vote
    const addedVote = await db.word.create({
      data: {
        word: word,
        votes: 1,
      },
    })
    console.log(addedVote)
  }

  return redirect('/')
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

  const actionForm = ({ word, votes }: LeaderBoardType) => {
    return (
      <Form method='POST' action=''>
        <input type='hidden' name='word' value={word} />
        <ClickableIcon votes={votes} />
        <button type='submit' className='hidden'>
          Submit
        </button>
      </Form>
    )
  }

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
        <LeaderBoard data={data} actionForm={actionForm} />
      </main>
    </>
  )
}
