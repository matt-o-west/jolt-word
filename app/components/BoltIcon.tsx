import BoltIcon from '@mui/icons-material/Bolt'
import Skeleton from '@mui/material/Skeleton'
import useMobileDetect from '~/hooks/useMobileDetect'
import { useEffect, useState } from 'react'
//import zap from 'public/sound/zap.wav' // Import your sound effect file

type ClickableIconProps = {
  word: string
  votes: number
  handleClick: () => void
  storedValue: number | ((value: Function) => void)
  maxClicks: number
  loading: Boolean
}

function ClickableIcon({
  word,
  votes,
  handleClick,
  storedValue,
  maxClicks,
  loading,
}: ClickableIconProps) {
  const isMobile = useMobileDetect()
  let fontSize: 'medium' | 'large' = isMobile ? 'medium' : 'large'

  const parseVotes = (votes: number) => {
    if (votes > 1000) {
      return `${(votes / 1000).toFixed(1)}k`
    }
    return votes
  }

  const singleDigitStyling = (votes: number) => {
    if (votes < 10) {
      return 'top-[-2px] right-[0px]'
    } else if (votes < 100) {
      return 'top-[-2px] right-[-5px]'
    }
    return 'top-[-2px] right-[-10px]'
  }

  return (
    <>
      {loading && (
        <Skeleton variant='rectangular' animation='wave' className='mt-2 ml-2'>
          <BoltIcon fontSize={fontSize} />
        </Skeleton>
      )}
      {!loading && (
        <button
          className={`icon cursor-pointer ml-1 relative tablet:mb-1 phone:mb-3 ${
            isMobile ? 'w-6 h-6' : 'w-10 h-10'
          }`}
          onClick={handleClick}
          type='submit'
          disabled={storedValue === maxClicks}
        >
          <BoltIcon
            fontSize={fontSize}
            color={storedValue === 3 ? 'primary' : 'inherit'}
          />
          <span
            className={`absolute ${singleDigitStyling(
              votes
            )} bg-transparent rounded-full px-1 py-0.5 text-xs`}
          >
            {parseVotes(votes)}
          </span>
        </button>
      )}
    </>
  )
}

export default ClickableIcon
