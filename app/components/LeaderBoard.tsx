import React from 'react'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import BoardCard from './BoardCard'
import type { WordProps } from './BoardCard'

import { db } from 'prisma/db.server'

export const loader = async () => {
  const leaderboard = await db.word.findMany({
    orderBy: {
      votes: 'desc',
    },
  })

  return json(leaderboard)
}

const LeaderBoard = () => {
  const leaderboard = useLoaderData<typeof loader>()
  console.log(leaderboard)

  return (
    <div>
      <h1 className='text-2xl font-bold text-center mt-20'>Leaderboard</h1>
      <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-20 text-center sm:py-0'>
        {leaderboard &&
          leaderboard.map(({ word, votes, id }, index) => (
            <BoardCard votes={votes} name={word} rank={index + 1} key={id} />
          ))}
      </div>
    </div>
  )
}

export default LeaderBoard
