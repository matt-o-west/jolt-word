import React from 'react'
//import { useState, useEffect } from 'react'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { getRandomWord } from '~/models/dictionary.server'

export const loader: LoaderFunction = async () => {
  const randomWord = await getRandomWord()
  console.log(randomWord)
  return json(randomWord)
}

const Words = () => {
  const data = useLoaderData<typeof loader>()

  return <div>Hey wordsmith, here's your word for today 🫴 {data.word}</div>
}

export default Words
