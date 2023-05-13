import React from 'react'
import BoardCard from './BoardCard'
import { useContext } from 'react'
import { Context } from '~/root'
//import type { WordProps } from './BoardCard'

import { SavedSearch } from '@mui/icons-material'

type ActionFormFunction = ({ word, votes }: LeaderBoardType) => JSX.Element

export type LeaderBoardType = {
  id?: number
  word: string
  votes: number
  wordData?: {
    id: number
    word: string
    vote: number
  }
}

export type DataProps = {
  ranked?: boolean
  data: LeaderBoardType[]
  actionForm: ActionFormFunction
}

const LeaderBoard = ({ data, actionForm, ranked }: DataProps) => {
  const { featureTheme } = useContext(Context)

  return (
    <div className='flex flex-col items-center text-black min-h-screen w-full py-2 mt-2 text-center sm:py-0'>
      {data &&
        data.map(
          ({ word, votes, id, wordData }: LeaderBoardType, index: number) => {
            const actualWord = wordData ? wordData.word : word
            return (
              <BoardCard
                votes={votes}
                word={actualWord}
                rank={ranked ? index + 1 : 0}
                key={id}
                actionForm={actionForm}
              />
            )
          }
        )}
    </div>
  )
}

export default LeaderBoard
