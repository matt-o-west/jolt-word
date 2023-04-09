import React from 'react'
import ClickableIcon from './BoltIcon'

export type WordProps = {
  rank: number
  list: any
  votes: number
}

const BoardCard = ({ rank, list, votes }: WordProps) => {
  return (
    <div className='flex flex-row align-middle w-full'>
      <ClickableIcon />
      <span className='mx-2'>{rank}</span>
      <span className='mx-2'>{list.word}</span>
      <span className='mx-2 justify-self-end'>{votes}</span>
    </div>
  )
}

export default BoardCard
