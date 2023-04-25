import { useEffect, useContext, useState } from 'react'
import { Link, Form } from '@remix-run/react'
import { useLoaderData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Context } from '~/root'
import DescriptionPane from '~/components/DescriptionPane'
import type { LeaderBoardType } from '~/components/LeaderBoard'
import Nav from '~/components/Nav'
import LeaderBoard from '~/components/LeaderBoard'
import { requireUserId } from '~/utils/session.server'
import generateRandomWord from '~/utils/generateRandomWord.server'
import ClickableIcon from '~/components/BoltIcon'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import SavedSearchIcon from '@mui/icons-material/SavedSearch'

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
  const [showLeaderBoard, setShowLeaderBoard] = useState(true)

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
        <div className='grid grid-cols-5 grid-rows-2 w-full'>
          {loggedInUser && (
            <div className='col-span-3 row-span-2'>
              <div className='flex justify-between w-full gap-4 mt-12'>
                <h1
                  onClick={() => setShowLeaderBoard(true)}
                  className={showLeaderBoard ? 'font-bold' : 'text-gray-500'}
                >
                  <span className='flex cursor-pointer bg-purple.100 px-4 py-1 rounded-md italic'>
                    <span className='pr-2'>
                      <LeaderboardIcon />
                    </span>
                    Leaderboard
                  </span>
                </h1>

                <h1
                  onClick={() => setShowLeaderBoard(false)}
                  className={!showLeaderBoard ? 'font-bold' : 'text-gray-500'}
                >
                  <span className='flex cursor-pointer bg-tertiary.gray px-4 py-1 rounded-md italic'>
                    <SavedSearchIcon />
                    <span className='pl-2'>My Words</span>
                  </span>
                </h1>
              </div>
            </div>
          )}

          <div
            className={`relative min-h-[450px] col-span-3 row-span-2 ${
              !loggedInUser && 'mt-16'
            }`}
          >
            <div
              className='absolute w-full'
              style={{
                zIndex: showLeaderBoard ? 1 : 0,
                top: showLeaderBoard ? 0 : '10px',
                left: showLeaderBoard ? 0 : '10px',
              }}
            >
              <LeaderBoard
                data={leaderboard}
                actionForm={actionForm}
                ranked={true}
              />
            </div>
            {loggedInUser && (
              <div
                className='absolute w-full'
                style={{
                  zIndex: !showLeaderBoard ? 1 : 0,
                  top: showLeaderBoard ? '10px' : 0,
                  left: showLeaderBoard ? '10px' : 0,
                }}
              >
                <LeaderBoard
                  data={wordData}
                  actionForm={actionForm}
                  ranked={false}
                />
              </div>
            )}
          </div>
          <div className='relative flex flex-col w-1/3 items-center col-span-2 row-span-1 font-bold ml-14'>
            <img src='/images/icons-meter.png' alt='voltmeter' />
            <div className='absolute bottom-24 left-12 inset-0 flex items-center justify-center'>
              <span className='text-5xl font-bold text-green-500'>1</span>
            </div>
            <span className='text-green-500'>JOLT</span>
          </div>
          <div className='relative flex flex-col w-1/3 items-center col-span-2 row-span-1 font-bold ml-14'>
            <img src='/images/icons-meter.png' alt='voltmeter' />
            <div className='absolute bottom-24 left-12 inset-0 flex items-center justify-center'>
              <span className='text-5xl font-bold text-red'>1</span>
            </div>
            <span className='text-red'>LEECH</span>
          </div>
        </div>
        <DescriptionPane />
      </main>
    </>
  )
}
