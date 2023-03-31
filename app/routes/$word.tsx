import { Link } from '@remix-run/react'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '~/root'
import Nav from '~/components/Nav'
import Meaning from '~/components/Meaning'
import { useLoaderData } from '@remix-run/react'
import { getWord } from '~/models/dictionary.server'

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

export type DefinitionType = Definition[] | [Definition] | undefined

export const loader = async ({ params }) => {
  const word = await getWord(params.word)
  return word
}

const Word = () => {
  const { font, theme } = useContext(Context)

  const { word } = useParams()
  const data = useLoaderData<DefinitionType>()
  const meaningOne: Definition = data[0]
  const meaningTwo: Definition = data[1]
  const meaningThree: Definition = data[2]
  const subDirectory = data[0]?.hwi?.prs?.[0]?.sound?.ref?.split('/')[2]
  const baseFilename = data[0]?.hwi?.prs?.[0]?.sound?.ref?.split('/')[3]

  const audioReference = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subDirectory}/${baseFilename}.mp3`

  const handleClick = () => {
    try {
      const audio = new Audio(audioReference)
      audio.play()
    } catch (error) {
      console.log('Error playing audio:', error)
    }
  }

  if (!data) {
    return <div>Sorry, could not find data for {word}</div>
  }

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center font-${font} text-md p-2 py-1 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <div className='grid grid-flow-row grid-rows-2 grid-cols-2 w-11/12 justify-between'>
          <h1 className='self-center text-4xl font-bold'>{word}</h1>
          <button
            className='justify-self-end'
            aria-label='play button'
            onClick={handleClick}
          >
            <img
              src='./images/icon-play.svg'
              alt='play icon'
              className='w-10/12'
            />
          </button>
          <p className='flex justify-start text-2xl'>
            <span className='text-purple'>
              /{data[0]?.hwi?.prs?.[0]?.mw ?? ''}/
            </span>
          </p>
        </div>

        <div className='mx-4 justify-start min-w-[90%]'>
          <Meaning meaning={meaningOne} />
          {meaningTwo && <Meaning meaning={meaningTwo} />}
          {meaningThree && <Meaning meaning={meaningThree} />}
        </div>
      </main>
    </>
  )
}

export default Word
