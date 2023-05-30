import BoltIcon from '@mui/icons-material/Bolt'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useState, useEffect } from 'react'
import useMobileDetect from '~/hooks/useMobileDetect'
//import zap from 'public/sound/zap.wav' // Import your sound effect file

type ClickableIconProps = {
  word: string
  votes: number | undefined
  handleClick: () => void
  storedValue: number | ((value: Function) => void)
  maxClicks: number
}

function ClickableIcon({
  word,
  votes,
  handleClick,
  storedValue,
  maxClicks,
}: ClickableIconProps) {
  const isMobile = useMobileDetect()
  let fontSize: 'medium' | 'large' = isMobile ? 'medium' : 'large'
  console.log(
    'word: ',
    word,
    '  local value: ',
    storedValue,
    '  max clicks: ',
    maxClicks
  )
  console.log(storedValue === maxClicks)

  return (
    <>
      <button
        className={`icon cursor-pointer ml-auto relative tablet:mb-1 phone:mb-3 ${
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
        <span className='vote-count'>{votes}</span>
      </button>
    </>
  )
}

export default ClickableIcon
