//import { Link } from '@remix-run/react'
import { useParams } from 'react-router-dom'
import { useContext, Fragment } from 'react'
import { Context } from '~/root'
import Meaning from '~/components/Meaning'
import { useLoaderData } from '@remix-run/react'
import { getWord } from '~/models/dictionary.server'
import replaceTokens from '~/utils/replaceTokens'
import { json } from '@remix-run/node'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { requireUserId } from '~/utils/session.server'
import ActionForm from '~/components/ActionForm'
import { Error, isDefinitelyAnError } from '~/components/Error'
import { useRouteError } from '@remix-run/react'

import { db } from 'prisma/db.server'

export interface Definition {
  date: string
  fl: string
  meta: {
    id: string
    uuid: string
    src: string
    section: string
    stems: string[]
    offensive: boolean
  }
  hwi: {
    hw: string
    prs: {
      mw: string
      sound: {
        audio: string
        ref: string
      }
    }[]
  }
  shortdef: string[]
  def: {
    sseq: string[]
  }[]
  syns?: {
    pl: string
    pt: string[][]
  }
}

export type DefinitionType = [Definition, Definition?, Definition?] | undefined

export const loader = async ({ params, request }: LoaderArgs) => {
  if (!params.word) {
    return json({ error: 'Word parameter is missing.' }, { status: 404 })
  }

  const word: Definition = await getWord(params.word)

  if (!word) {
    throw new Response('Sorry, we could not find that word.', {
      status: 404,
    })
  }

  const vote = await db.word.findUnique({
    where: {
      word: params.word,
    },
  })
  const wordWithVote = { ...word, votes: vote?.votes }
  return json({ wordWithVote })
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
        votes: true,
      },
    })

    wordId = updatedVote.id
    return json({ votes: updatedVote.votes })
  } else {
    // If the word doesn't exist, create a new record with a single vote
    const addedVote = await db.word.create({
      data: {
        word: word as string,
        votes: 1,
      },
    })

    wordId = addedVote.id
  }

  const userId = await requireUserId(request)

  if (userId) {
    console.log('Checking for existing userWord:', userId, wordId)
    const userWord = await db.userWord.findUnique({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
    })

    const userWords = await db.userWord.findMany({
      where: {
        userId,
      },
    })

    if (!userWord) {
      console.log('Creating userWord:', userId, wordId)
      console.log('Existing user words:', userWords)
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
  }

  return null
}

const Word = () => {
  const { word } = useParams()
  const { theme } = useContext(Context)
  const { wordWithVote } = useLoaderData<DefinitionType>()

  //replace with error boundary
  if (!wordWithVote) {
    return <div>Sorry, could not find data for {word}</div>
  }

  const meaningOne: Definition = wordWithVote[0]
  const meaningTwo: Definition = wordWithVote[1]
  const meaningThree: Definition = wordWithVote[2]
  const subDirectory = meaningOne?.hwi?.prs?.[0]?.sound?.audio // audio subdirectory

  const checkSubdirectory = (subDirectory: string) => {
    if (subDirectory === 'bix') {
      return 'bix'
    }
    if (subDirectory === 'gg') {
      return 'gg'
    }
    if (subDirectory?.[0]?.match(/^[^\w\s]+/)) {
      return 'number'
    }

    return subDirectory?.slice(0, 1) || null
  }

  const audioReference = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${checkSubdirectory(
    subDirectory
  )}/${subDirectory}.mp3`

  const handleAudioClick = () => {
    try {
      const audio = new Audio(audioReference)
      audio.play()
    } catch (error) {
      console.log('Error playing audio:', error)
    }
  }

  const wordFontSize = () => {
    if (typeof word !== 'undefined' && word.length >= 14) {
      return 'tablet:text-4xl phone:text-3xl'
    }

    return null
  }

  return (
    <>
      <main
        className={`justify-center items-center text-md p-2 py-1 m-2 mt-8 flex-grow ${theme} desktop:max-w-3xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <section className='grid grid-flow-row grid-rows-2 grid-cols-[auto,minmax(0,1fr),minmax(0,1fr)] w-11/12 ml-6 justify-between'>
          <h1
            className={`self-center max-w-full font-bold tracking-wide ${
              wordFontSize() || 'tablet:text-5xl phone:text-3xl'
            }`}
          >
            {word}
          </h1>
          <div className='self-start desktop:mt-4 tablet:mt-4 phone:mt-6 ml-2 mb-5'>
            <ActionForm word={word as string} votes={wordWithVote.votes} />
          </div>
          {subDirectory && (
            <button
              className='justify-self-end'
              onClick={handleAudioClick}
              type='button'
            >
              <img
                src='./images/icon-play.svg'
                alt='Play Button'
                className='tablet:w-10/12 phone:w-8/12 phone:ml-2'
              />
            </button>
          )}
          <p className='flex justify-start desktop:text-2xl phone:text-xl row-start-2'>
            {wordWithVote[0]?.hwi?.prs?.[0]?.mw && (
              <span className='text-purple'>
                /{wordWithVote[0]?.hwi?.prs?.[0]?.mw ?? ''}/
              </span>
            )}
          </p>
        </section>
        <section className='flex flex-col mx-4 min-h-[525px]  justify-start desktop:min-w-[600px] tablet:min-w-[515px]'>
          {wordWithVote[0].et &&
            !wordWithVote[0].et[0][1].startsWith('see') && (
              <article
                className={`place-self-end text-sm text-end mb-2 ml-10 pr-4 pl-3 py-1 ${
                  theme === 'light' ? 'bg-light.purple' : 'bg-dark.purple'
                } rounded-md`}
              >
                {wordWithVote[0].et
                  ? replaceTokens(wordWithVote[0]?.et[0][1])
                  : replaceTokens(wordWithVote[1]?.et[0][1])}
              </article>
            )}
          <Meaning meaning={meaningOne} />
          {meaningTwo && meaningTwo.shortdef[0] !== meaningOne.shortdef[0] && (
            <Meaning meaning={meaningTwo} previousMeaning={meaningOne} />
          )}
          {meaningThree &&
            meaningTwo.shortdef[0] !== meaningThree.shortdef[0] && (
              <Meaning meaning={meaningThree} previousMeaning={meaningTwo} />
            )}
        </section>
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

export default Word
