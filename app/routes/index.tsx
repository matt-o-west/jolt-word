import { useEffect, useContext, useState } from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { Link, Form } from '@remix-run/react'
import { useLoaderData, useActionData } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { Context } from '~/root'
import DescriptionPane from '~/components/DescriptionPane'
import type { LeaderBoardType } from '~/components/LeaderBoard'
import Nav from '~/components/Nav'
import LeaderBoard from '~/components/LeaderBoard'
import {
  requireUserId,
  getUserSession,
  getUserVoteCount,
  updateUserVote,
  storage,
} from '~/utils/session.server'
import generateRandomWord from '~/utils/generateRandomWord.server'
import ClickableIcon from '~/components/BoltIcon'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SavedSearchIcon from '@mui/icons-material/SavedSearch'
import ShowMoreChip from '~/components/ShowMoreChip'

import { db } from 'prisma/db.server'
import useMobileDetect from '~/hooks/useMobileDetect'

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
    await db.word.update({
      where: {
        word: word as string,
      },
      data: {
        votes: {
          increment: 1,
        },
      },
    })
  } else {
    // If the word doesn't exist, create a new record with a single vote
    await db.word.create({
      data: {
        word: word as string,
        votes: 1,
      },
    })
  }

  return null
}

export const ActionForm = ({ word, votes }: LeaderBoardType) => {
  const maxClicks = 3
  const [storedValue, setStoredValue] = useLocalStorage<number>(word, 0, 120)
  const [clicks, setClicks] = useState(storedValue as number)

  useEffect(() => {
    if (clicks <= maxClicks) {
      setStoredValue(clicks)
    }
  }, [clicks, setStoredValue])

  const handleClick = () => {
    if (clicks < maxClicks) {
      setClicks(clicks + 1)
    }
  }

  return (
    <Form method='post' action=''>
      <input type='hidden' name='word' value={word} />
      <ClickableIcon
        votes={votes}
        word={word}
        handleClick={handleClick}
        storedValue={storedValue}
        maxClicks={maxClicks}
      />
      <button type='submit' className='hidden'>
        Submit
      </button>
    </Form>
  )
}

export default function Index() {
  const { font, theme, featureTheme, setUser } = useContext(Context)
  const { leaderboard, loggedInUser, user, randomWord, userWords } =
    useLoaderData<typeof loader>()
  const [showLeaderBoard, setShowLeaderBoard] = useState(true)
  const isMobile = useMobileDetect()
  const data = useActionData<typeof action>()

  console.log(typeof data)

  useEffect(() => {
    if (loggedInUser && (user?.username || user?.username === '')) {
      setUser(user?.username)
    } else {
      setUser('')
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

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
        className={`flex flex-col justify-center items-center font-${font} text-md p-2 py-8 mt-6 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
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
          <span
            className={`${featureTheme} text-sm text-gray-500 bg-tertiary.gray rounded-sm px-2 py-1 tracking-wide -mt-6 -ml-4 mr-10`}
          >
            Word of the Day
          </span>
        </div>
        <div
          className={`w-full desktop:grid desktop:grid-cols-5 ${
            loggedInUser ? 'desktop:grid-rows-2' : 'desktop:grid-rows-1'
          } phone:flex phone:flex-col`}
        >
          {loggedInUser && (
            <div className='col-span-3 row-span-2'>
              <div className='flex justify-between phone:justify-around w-full gap-4 mt-12'>
                <h1
                  onClick={() => setShowLeaderBoard(true)}
                  className={showLeaderBoard ? 'font-bold' : 'text-gray-500'}
                >
                  <span className='flex cursor-pointer bg-purple.100 text-black px-4 py-1 rounded-md italic phone:text-lg'>
                    <span className='pr-2'>
                      <TrendingUpIcon />
                    </span>
                    Trending
                  </span>
                </h1>

                <h1
                  onClick={() => setShowLeaderBoard(false)}
                  className={!showLeaderBoard ? 'font-bold' : 'text-gray-500'}
                >
                  <span
                    className={`${featureTheme} flex cursor-pointer bg-tertiary.gray px-4 py-1 rounded-md italic phone:text-lg`}
                  >
                    <SavedSearchIcon />
                    <span className='pl-2'>My Words</span>
                  </span>
                </h1>
              </div>
            </div>
          )}

          <div
            className={`relative min-h-[24rem] col-span-3 row-span-2 content-center ${
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
                ActionForm={ActionForm}
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
                <div className='relative'>
                  <LeaderBoard
                    data={wordData}
                    ActionForm={ActionForm}
                    ranked={false}
                  />
                  <Link to='/user/mywords'>
                    <ShowMoreChip
                      isStatic={isMobile}
                      isDarkMode={featureTheme === 'feature-dark'}
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className='flex desktop:flex-col desktop:space-x-6 tablet:flex-row tablet:space-x-10 phone:flex-row phone:space-x-10 items-center justify-center  mb-10'>
            <div className='relative flex flex-col items-center justify-center h-full col-span-2 row-span-1 font-bold desktop:ml-6 desktop:my-6'>
              <div className='flex items-center flex-row'>
                <img src='/images/icons-meter.png' alt='voltmeter' />
                <span className='text-5xl font-bold text-green-500 ml-2 flex-grow min-w-full'>
                  +3
                </span>
              </div>
              <span className='text-green-500 desktop:mr-2 tablet:mr-14 phone:mr-16'>
                JOLT
              </span>
            </div>
            <div className='relative flex flex-col items-center justify-center h-full col-span-2 row-span-1 font-bold'>
              <div className='flex items-center flex-row'>
                <img src='/images/icons-meter.png' alt='voltmeter' />
                <span className='text-5xl font-bold text-red ml-2 flex-grow min-w-full'>
                  –1
                </span>
              </div>
              <span className='text-red mr-2 desktop:mr-2 tablet:mr-14 phone:mr-16'>
                LEECH
              </span>
            </div>
          </div>
        </div>
        <DescriptionPane />
      </main>
    </>
  )
}
