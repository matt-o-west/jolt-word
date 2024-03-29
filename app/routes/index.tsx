import { useContext, useState } from 'react'
import { Link } from '@remix-run/react'
import { useLoaderData } from '@remix-run/react'
import { json } from '@vercel/remix'
import type { ActionArgs, LoaderArgs } from '@vercel/remix'
import { Context } from '~/root'
import DescriptionPane from '~/components/DescriptionPane'
import LeaderBoard from '~/components/LeaderBoard'
import { requireUserId } from '~/utils/session.server'
import generateRandomWord from '~/utils/generateRandomWord.server'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SavedSearchIcon from '@mui/icons-material/SavedSearch'
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter'
import ShowMoreChip from '~/components/ShowMoreChip'
import { Error, isDefinitelyAnError } from '~/components/Error'
import { useRouteError } from '@remix-run/react'

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
  console.log(user)
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

  let wordId: string
  const userId = await requireUserId(request)

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
      select: {
        id: true,
        votes: true,
      },
    })

    wordId = updatedVote.id

    if (userId) {
      await createUserWord(userId, wordId)
    }

    return json({ votes: updatedVote.votes })
  } else {
    // If the word doesn't exist, create a new record with a single vote
    const addedVote = await db.word.create({
      data: {
        word: word as string,
        votes: 1,
      },
      select: {
        id: true,
      },
    })

    wordId = addedVote.id

    if (userId) {
      await createUserWord(userId, wordId)
    }
  }
}

async function createUserWord(userId: string, wordId: string) {
  // Check if the user-word association already exists
  const userWord = await db.userWord.findUnique({
    where: {
      userId_wordId: {
        userId,
        wordId,
      },
    },
  })

  if (!userWord) {
    // If it doesn't exist, create it
    try {
      await db.userWord.create({
        data: {
          userId,
          wordId,
        },
      })
    } catch (error) {
      console.error('Error creating userWord:', error)
    }
  }

  return null
}

export default function Index() {
  const { theme, featureTheme } = useContext(Context)
  const { leaderboard, loggedInUser, randomWord, userWords } =
    useLoaderData<typeof loader>()
  const [showLeaderBoard, setShowLeaderBoard] = useState(true)
  const isMobile = useMobileDetect()

  const wordData = userWords.map((word) => {
    return {
      word: word.word.word,
      votes: word.word.votes,
    }
  })

  const wordFontSize = (word: string) => {
    if (typeof word !== 'undefined' && word.length > 14) {
      return 'tablet:text-3xl phone:text-2xl ml-4'
    }

    return null
  }

  return (
    <>
      <main
        className={`flex flex-col justify-center items-center text-md p-2 mt-6 mb-32 m-2 ${theme} desktop:max-w-3xl tablet:max-w-xl phone:max-w-[315px] phone:mx-auto`}
      >
        <section className='flex items-start desktop:mt-4 tablet:mt-2'>
          {(
            <Link
              to={`/${randomWord}`}
              className={`text-4xl font-bold text-purple transition-all duration-250 hover:scale-110 ${wordFontSize(
                randomWord
              )}`}
            >
              {randomWord}
            </Link>
          ) || 'sorry, we ran out of words'}
          <span
            className={`${featureTheme} desktop:text-sm phone:text-xs phone:min-w-fit text-gray-500 bg-tertiary.gray rounded-sm px-2 py-1 tracking-wide -mt-4 -ml-4`}
          >
            Word of the Day
          </span>
        </section>
        <section
          className={`w-full desktop:grid desktop:grid-cols-5 ${
            loggedInUser ? 'desktop:grid-rows-2' : 'desktop:grid-rows-1'
          } phone:flex phone:flex-col`}
        >
          {loggedInUser && (
            <div className='col-span-3 row-span-2'>
              <div className='flex justify-between phone:justify-around w-full gap-4 mt-12'>
                <button
                  onClick={() => setShowLeaderBoard(true)}
                  className={`z-20 ${
                    showLeaderBoard ? 'font-bold' : 'text-gray-500'
                  }`}
                >
                  <span className='flex font-sans-serif cursor-pointer bg-purple.100 text-black px-3 py-1 rounded-sm italic phone:text-lg'>
                    <span className='mr-1'>
                      <TrendingUpIcon />
                    </span>
                    Trending
                  </span>
                </button>

                <button
                  onClick={() => setShowLeaderBoard(false)}
                  className={`z-20 ${
                    !showLeaderBoard ? 'font-bold' : 'text-gray-500'
                  }`}
                >
                  <span
                    className={`${featureTheme} flex font-sans-serif cursor-pointer bg-tertiary.gray px-3 py-1 rounded-sm italic phone:text-lg`}
                  >
                    <span className='mt-0.25 mr-0.5'>
                      <SavedSearchIcon />
                    </span>
                    <span className='pl-1'>My Words</span>
                  </span>
                </button>
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
              <LeaderBoard data={leaderboard} ranked={true} />
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
                  <LeaderBoard data={wordData} ranked={false} />
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
          <div className='flex desktop:flex-col desktop:space-x-6 tablet:flex-row tablet:space-x-10 phone:flex-row phone:space-x-6 items-center justify-center  mb-10'>
            <div
              className={`relative flex flex-col items-center justify-center h-full col-span-2 row-span-1 font-bold desktop:ml-6 ${
                loggedInUser ? 'desktop:my-10' : 'desktop:mt-12'
              }`}
            >
              <div className='flex items-center flex-row'>
                <ElectricMeterIcon
                  sx={{
                    width: { xs: '5rem', sm: '6rem' },
                    height: { xs: '5rem', sm: '6rem' },
                    marginLeft: '1.5rem',
                    fill: theme === 'dark' ? '#B88BEF' : '#523B63',
                  }}
                />
                <span className='text-5xl font-bold text-green-500 ml-2 flex-grow min-w-full phone:text-4xl'>
                  +3
                </span>
              </div>
              <span className='text-green-500 desktop:mr-2 tablet:mr-14 phone:mr-16'>
                JOLT
              </span>
            </div>
            <div className='relative flex flex-col items-center justify-center h-full col-span-2 row-span-1 font-bold'>
              <div className='flex items-center flex-row'>
                <ElectricMeterIcon
                  sx={{
                    width: { xs: '5rem', sm: '6rem' },
                    height: { xs: '5rem', sm: '6rem' },
                    fill: theme === 'dark' ? '#B88BEF' : '#523B63',
                  }}
                />
                <span className='text-5xl font-bold text-red ml-2 flex-grow min-w-full phone:text-4xl'>
                  –1
                </span>
              </div>
              <span className='text-red mr-2 desktop:mr-2 tablet:mr-14 phone:mr-16'>
                LEECH
              </span>
            </div>
          </div>
        </section>
        <DescriptionPane />
      </main>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  let errorMessage = 'Unknown error'
  if (isDefinitelyAnError(error)) {
    errorMessage = error.message
  }

  return <Error errorMessage={errorMessage} />
}
