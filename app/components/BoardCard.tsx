import React from 'react'
import type { LeaderBoardType } from './LeaderBoard'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '~/root'
import { styled } from '@mui/system'
import ClearIcon from '@mui/icons-material/Clear'

type ActionFormFunction = ({ word, votes }: LeaderBoardType) => JSX.Element

export type WordProps = {
  rank?: number | undefined
  ranked?: boolean | undefined
  word: string
  votes: number
  myWords: boolean
  width?: string | undefined
  actionForm: ActionFormFunction
  deleteForm?: ActionFormFunction
}

const ClearWord = styled(ClearIcon)({
  color: 'red',
  cursor: 'pointer',
  margin: '0.2rem 1rem 0 0',
  transition: 'transform 0.06s ease-in-out',
  '&:hover': {
    transform: 'scale(1.2)',
  },
})

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
  actionForm,
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
      {myWords && <ClearWord />}
      <span className='mx-2'>
        <Link to={`/${word}`}>{word}</Link>
      </span>
      <div className='ml-auto tablet:mb-2'>{actionForm({ word, votes })}</div>
    </div>
  )
}

export default BoardCard
