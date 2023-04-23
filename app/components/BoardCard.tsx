import React from 'react'
import type { LeaderBoardType } from './LeaderBoard'

type ActionFormFunction = ({ word, votes }: LeaderBoardType) => JSX.Element

export type WordProps = {
  rank?: number | undefined
  ranked?: boolean | undefined
  word: string
  votes: number
  actionForm: ActionFormFunction
}

const getRankColor = (rank: number) => {
  const colors = [
    'bg-purple.100',
    'bg-purple.200',
    'bg-purple.300',
    'bg-purple.400',
    'bg-purple.500',
  ]
  return colors[rank - 1]
}

const BoardCard = ({
  rank = 0,
  ranked = false,
  word,
  votes,
  actionForm,
}: WordProps) => {
  const rankColor = ranked ? getRankColor(rank) : false

  const notRanked = 'bg-tertiary.gray border-b-2 border-gray'

  return (
    <div
      className={`flex py-2 px-4 items-center rounded-sm text-2xl ${
        rankColor || notRanked
      } w-[235px]`}
    >
      <span className='font-subhead text-3xl mx-2 mr-6' hidden={!rankColor}>
        {rank}
      </span>
      <span className='mx-2'>{word}</span>
      <div className='ml-auto'>{actionForm({ word, votes })}</div>
    </div>
  )
}

export default BoardCard
