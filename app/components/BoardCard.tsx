import React from 'react'
import type { LeaderBoardType } from './LeaderBoard'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '~/root'
import { updateUserVote, getUserVoteCount } from '~/utils/session.server'

type ActionFormFunction = ({ word, votes }: LeaderBoardType) => JSX.Element

export type WordProps = {
  rank?: number | undefined
  ranked?: boolean | undefined
  word: string
  votes?: number
  myWords: boolean
  width?: string | undefined
  ActionForm: ActionFormFunction
  deleteForm?: ActionFormFunction
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
  word,
  votes,
  width = 'w-[335px]',
  myWords = false,
  ActionForm,
  deleteForm,
}: WordProps) => {
  const { featureTheme } = useContext(Context)
  const rankColor = getRankColor(rank)

  const notRanked = `${featureTheme} border-b-2 border-gray`

  return (
    <div
      className={`flex py-2 px-4 items-center rounded-sm text-2xl ${
        rankColor || notRanked
      } ${width} h-[62px]`}
    >
      <span className='font-subhead text-3xl mx-2 mr-6' hidden={!rankColor}>
        {rank}
      </span>
      {myWords && deleteForm && deleteForm({ word })}
      <span className='mx-2'>
        <Link to={`/${word}`}>{word}</Link>
      </span>
      <div className='ml-auto tablet:mb-2'>
        {ActionForm && typeof ActionForm === 'function'
          ? ActionForm({ word, votes })
          : null}
      </div>
    </div>
  )
}

export default BoardCard
