import React from 'react'
import BoardCard from './BoardCard'
//import type { WordProps } from './BoardCard'

export type LeaderBoardType = {
  id: number
  list: {
    word: string
  }
  votes: number
}

export type DataProps = {
  data: LeaderBoardType[]
}

const LeaderBoard = ({ data }: DataProps) => {
  return (
    <div>
      <h1 className='font-subhead text-3xl font-bold text-center mt-20'>
        Leaderboard
      </h1>
      <div className='flex flex-col items-center text-black w-full min-h-screen py-2 mt-6 text-center sm:py-0'>
        {data &&
          data.map(({ list, votes, id }: LeaderBoardType, index: number) => (
            <BoardCard votes={votes} list={list} rank={index + 1} key={id} />
          ))}
      </div>
    </div>
  )
}

export default LeaderBoard
