import { useContext } from 'react'
import BoardCard from './BoardCard'
import PaperPlane from '~/components/PaperPlane'
import { Context } from '~/root'

//import type { WordProps } from './BoardCard'

interface WordData {
  id: number
  word: string
  vote: number
}
export interface LeaderBoardType {
  id?: number
  word: string
  votes?: number
  userWords?: WordData[]
  wordData?: WordData
}

export type DataProps = {
  ranked?: boolean
  data: LeaderBoardType[]
}

const LeaderBoard = ({ data, ranked }: DataProps) => {
  const { theme } = useContext(Context)

  return (
    <div className='flex flex-col items-center text-black min-h-screen w-full py-2 mt-2 text-center sm:py-0 rounded-sm'>
      {data &&
        data.map(
          ({ word, votes, id, wordData }: LeaderBoardType, index: number) => {
            const actualWord = wordData ? wordData.word : word
            return (
              <BoardCard
                votes={votes}
                word={actualWord}
                myWords={false}
                rank={ranked ? index + 1 : 0}
                key={id}
              />
            )
          }
        )}
      {data.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center rounded-sm w-[335px] h-[315px] ${
            theme === 'light' ? 'bg-tertiary.gray' : 'bg-quaternary.black'
          }`}
        >
          <PaperPlane />
          <span
            className={`text-xl ${
              theme === 'light' ? 'text-quaternary.black' : 'text-tertiary.gray'
            }`}
          >
            When you vote on words, they'll appear here.
          </span>
        </div>
      )}
    </div>
  )
}

export default LeaderBoard
