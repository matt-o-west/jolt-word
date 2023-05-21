import BoltIcon from '@mui/icons-material/Bolt'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useState, useEffect } from 'react'
import useMobileDetect from '~/hooks/useMobileDetect'
//import zap from 'public/sound/zap.wav' // Import your sound effect file

type ClickableIconProps = {
  word: string
  votes: number
}

function ClickableIcon({ word, votes }: ClickableIconProps) {
  const maxClicks = 3
  const [storedValue, setStoredValue] = useLocalStorage(word, 0, 120)

  const isMobile = useMobileDetect()
  let fontSize: 'medium' | 'large' = isMobile ? 'medium' : 'large'

  const handleClick = () => {
    if (storedValue < maxClicks) {
      setStoredValue((prevCount) => prevCount + 1)
    }
  }

  const displayVotes = () => {
    if (storedValue === maxClicks) {
      return votes + 1
    } else {
      return votes
    }
  }

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
          color={storedValue === maxClicks ? 'primary' : 'inherit'}
        />
        <span className='vote-count'>{displayVotes()}</span>
      </button>
    </>
  )
}

export default ClickableIcon
