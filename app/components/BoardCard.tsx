import React from 'react'
import ClickableIcon from './BoltIcon'

export type WordProps = {
  rank: number
  list: any
  votes: number
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

const BoardCard = ({ rank, list, votes }: WordProps) => {
  const rankColor = getRankColor(rank)

  return (
    <div
      className={`flex items-center py-2 px-4 rounded-sm text-2xl ${rankColor} w-full`}
    >
      <span className='mx-2'>{rank}</span>
      <span className='mx-2'>{list.word}</span>
      <ClickableIcon votes={votes} />
    </div>
  )
}

export default BoardCard
