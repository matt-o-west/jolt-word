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

  console.log(data)

  if (!data) {
    return <div>Sorry, could not find data for {word}</div>
  }

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center font-${font} text-md p-2 py-1 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <h1 className='text-4xl font-bold'>{word}</h1>
        <p className='text-2xl'>{data[0]?.hwi?.prs?.[0]?.mw ?? ''}</p>
        <button className='text-2xl' aria-label='play button'>
          <img src='./images/icon-play.svg' alt='play icon' />
        </button>
        <Meaning meaning={meaningOne} />
        {data[1] && (
          <>
            <p className='text-2xl'>{data[1]?.fl}</p>
            <ol>
              <li>
                <p className='text-2xl'>{data[1]?.shortdef?.[0]}</p>
              </li>
              <li>
                <p className='text-2xl'>{data[1]?.shortdef?.[1]}</p>
              </li>
            </ol>
          </>
        )}
      </main>
    </>
  )
}

export default Word
