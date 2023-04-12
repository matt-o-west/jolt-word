//import { Link } from '@remix-run/react'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '~/root'
import Nav from '~/components/Nav'
import Meaning from '~/components/Meaning'
import ClickableIcon from '~/components/BoltIcon'
import { useLoaderData /*useActionData*/, useSubmit } from '@remix-run/react'
import { getWord } from '~/models/dictionary.server'
import replaceTokens from '~/utils/replaceTokens'
import { json } from '@remix-run/node'
import type { LoaderArgs, ActionArgs } from '@remix-run/node'
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
  votes: number
}

export type DefinitionType = [Definition, Definition?, Definition?] | undefined

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.word) {
    return json({ error: 'Word parameter is missing.' }, { status: 404 })
  }

  const word: Definition = await getWord(params.word)
  const vote = await db.word.findUnique({
    where: {
      word: params.word,
    },
  })
  const wordWithVote = { ...word, votes: vote?.votes }
  return json(wordWithVote)
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

  return null
}

const Word = () => {
  const { word } = useParams()
  const { theme, featureTheme } = useContext(Context)
  const data = useLoaderData<DefinitionType>()

  //replace with error boundary
  if (!data) {
    return <div>Sorry, could not find data for {word}</div>
  }

  const meaningOne: Definition = data[0]
  const meaningTwo: Definition = data[1]
  const meaningThree: Definition = data[2]
  const subDirectory = meaningOne?.hwi?.prs?.[0]?.sound?.audio // audio subdirectory

  const etymology =
    data.length > 0 &&
    meaningOne.et &&
    meaningOne.et.length > 0 &&
    meaningOne.et[0].length > 0
      ? meaningOne.et[0][1]
      : ''

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

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center text-md p-2 py-1 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <div className='grid grid-flow-row grid-rows-2 grid-cols-[auto,minmax(0,1fr),minmax(0,1fr)] w-11/12 justify-between'>
          <h1 className='self-center text-5xl font-bold tracking-wide'>
            {word}
          </h1>
          <div className='self-start mt-4 ml-2'>
            <form method='POST' action={`/${word}`}>
              <input type='hidden' name='word' value={word} />
              <ClickableIcon votes={data.votes} />
              <button type='submit' className='hidden'>
                Submit
              </button>
            </form>
          </div>
          {subDirectory && (
            <button
              className='justify-self-end'
              aria-label='play button'
              onClick={handleAudioClick}
            >
              <img
                src='./images/icon-play.svg'
                alt='play icon'
                className='w-10/12'
              />
            </button>
          )}
          <p className='flex justify-start text-2xl'>
            {data[0]?.hwi?.prs?.[0]?.mw && (
              <span className='text-purple'>
                /{data[0]?.hwi?.prs?.[0]?.mw ?? ''}/
              </span>
            )}
          </p>
        </div>

        <div className='mx-4 justify-start min-w-[90%]'>
          <Meaning meaning={meaningOne} />
          {meaningTwo && <Meaning meaning={meaningTwo} />}
          {meaningThree && <Meaning meaning={meaningThree} />}
        </div>

        {etymology && (
          <span
            className={`${featureTheme} text-sm text-end font-light rounded-lg self-end mt-6 p-2 pr-3 pl-4 w-4/5`}
          >
            {replaceTokens(etymology)}
          </span>
        )}
      </main>
    </>
  )
}

export default Word
