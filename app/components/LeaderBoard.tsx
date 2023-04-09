import React from 'react'
import BoardCard from './BoardCard'
//import type { WordProps } from './BoardCard'

export type LeaderBoardProps = {
  id: number
  list: {
    word: string
  }
  votes: number
}

const LeaderBoard = ({ data }) => {
  console.log(data)

  return (
    <div>
      <h1 className='text-2xl font-bold text-center mt-20'>Leaderboard</h1>
      <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-20 text-center sm:py-0'>
        {data &&
          data.map(({ list, votes, id }: LeaderBoardProps, index: number) => (
            <BoardCard votes={votes} list={list} rank={index + 1} key={id} />
          ))}
      </div>
    </div>
  )
}

export default LeaderBoard
