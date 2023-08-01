import type { LeaderBoardType } from './LeaderBoard'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from '~/root'
import ActionForm from '~/components/ActionForm'

type ActionFormFunction = ({ word, votes }: LeaderBoardType) => JSX.Element

export type WordProps = {
  rank?: number | undefined
  ranked?: boolean | undefined
  word: string
  votes?: number
  myWords: boolean
  width?: string | undefined
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
  deleteForm,
}: WordProps) => {
  const { featureTheme } = useContext(Context)
  const rankColor = getRankColor(rank)
  //console.log(`Passed down votes: ${votes}, word: ${word}`)
  const notRanked = `${featureTheme} border-b-2 border-gray`
  const shortenedWord = (word: string) => {
    const length = word.length
    if (length > 11 && width === 'w-[300px]') {
      return word.slice(0, 11) + '...'
    } else if (length > 16 && width === 'w-[335px]') {
      return word.slice(0, 16) + '...'
    }
    return word
  }

  return (
    <article
      className={`flex py-2 px-4 items-center rounded-sm text-2xl ${
        rankColor || notRanked
      } ${width} h-[62px]`}
      title={word}
    >
      <span className='font-subhead text-3xl mx-2 mr-6' hidden={!rankColor}>
        {rank}
      </span>
      {myWords && deleteForm && deleteForm({ word })}
      <span className='mx-2'>
        <Link to={`/${word}`} aria-label={word}>
          {shortenedWord(word)}
        </Link>
      </span>
      <div className='ml-auto tablet:mb-2' aria-label='Upvote'>
        {ActionForm({ word, votes })}
      </div>
    </article>
  )
}

export default BoardCard
