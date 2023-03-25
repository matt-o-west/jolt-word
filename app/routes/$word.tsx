import { Link } from '@remix-run/react'
import { useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Context } from '~/root'
import { getWord } from '~/models/dictionary.server'
import Nav from '~/components/Nav'

const Word = () => {
  const { font, theme } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const { word } = useParams()

  useEffect(() => {
    const fetchWord = async (word: string) => {
      setLoading(true)
      const result = await getWord(word)
      setData(result)
      setLoading(false)
    }
    if (word) {
      fetchWord(word)
    }
  }, [word])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Sorry, could not find data for {word}</div>
  }

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center font-${font} text-md p-2 py-8 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <h1 className='text-4xl font-bold'>{data?.hwi?.hw}</h1>
        <p className='text-2xl'>{data?.fl}</p>
        <p className='text-2xl'>{data?.shortdef}</p>
      </main>
    </>
  )
}

export default Word
