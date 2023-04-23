import { useEffect, useContext } from 'react'
import { Link, Form } from '@remix-run/react'
import { Context } from '~/root'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import generateRandomWord from '~/utils/generateRandomWord.server'
import Nav from '~/components/Nav'
import LeaderBoard from '~/components/LeaderBoard'
import ClickableIcon from '~/components/BoltIcon'
import DescriptionPane from '~/components/DescriptionPane'
import type { LeaderBoardType } from '~/components/LeaderBoard'
import { requireUserId } from '~/utils/session.server'

import { db } from 'prisma/db.server'

export const loader = async ({ request }: LoaderArgs) => {
  const redirectTo = '/login'

  const leaderboard = await db.word.findMany({
    orderBy: {
      votes: 'desc',
    },
    take: 5,
  })

  const loggedInUser = await requireUserId(request, redirectTo)
  const user = loggedInUser
    ? await db.user.findUnique({
        where: {
          id: loggedInUser,
        },
      })
    : null

  const randomWord = await generateRandomWord()

  if (user) {
    const userWords = await db.userWord.findMany({
      where: {
        user,
      },
      orderBy: {
        word: {
          votes: 'desc',
        },
      },
      take: 5,
      include: {
        word: true,
      },
    })

    if (userWords.length === 0) {
      return json({ loggedInUser, userWords, leaderboard, user, randomWord })
    }
    return json({ loggedInUser, userWords, leaderboard, user, randomWord })
  }

  return json({ leaderboard, loggedInUser, user, randomWord, userWords: [] })
}

export const action = async ({ request }: ActionArgs) => {
  // Get the request body as a FormData object
  const formData = await request.formData()

  // Access the word from the request body
  const word = formData.get('word')

  // Try to find the existing word
  const existingWord = await db.word.findUnique({
    where: {
      word: word as string,
    },
  })

  if (existingWord) {
    // If the word exists, update its vote count
    const updatedVote = await db.word.update({
      where: {
        word: word as string,
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
        word: word as string,
        votes: 1,
      },
    })
    console.log(addedVote)
  }

  return redirect('/')
}

export default function Index() {
  const { font, theme, setUser } = useContext(Context)
  const { leaderboard, loggedInUser, user, randomWord, userWords } =
    useLoaderData<typeof loader>()

  console.log(userWords)

  useEffect(() => {
    if (loggedInUser && (user?.username || user?.username === '')) {
      setUser(user?.username)
    } else {
      setUser('')
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const actionForm = ({ word, votes }: LeaderBoardType) => {
    return (
      <Form method='post' action=''>
        <input type='hidden' name='word' value={word} />
        <ClickableIcon votes={votes} />
        <button type='submit' className='hidden'>
          Submit
        </button>
      </Form>
    )
  }

  const wordData = userWords.map((word) => {
    return {
      word: word.word.word,
      votes: word.word.votes,
    }
  })

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center font-${font} text-md p-2 py-8 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <div className='flex items-start'>
          {(
            <Link
              to={`/${randomWord}`}
              className='text-4xl font-bold text-purple transition-all duration-250 hover:scale-110'
            >
              {randomWord}
            </Link>
          ) || 'sorry, we ran out of words'}
          <span className='text-sm text-gray-500 bg-tertiary.gray rounded-sm px-2 py-1 tracking-wide -mt-6 -ml-4 mr-10'>
            Random Word of the Day
          </span>
        </div>

        <div className='grid grid-cols-2 gap-10'>
          <LeaderBoard
            data={leaderboard}
            actionForm={actionForm}
            ranked={true}
          />
          {loggedInUser && (
            <LeaderBoard
              data={wordData}
              actionForm={actionForm}
              ranked={false}
            />
          )}
        </div>
        <DescriptionPane />
      </main>
    </>
  )
}
