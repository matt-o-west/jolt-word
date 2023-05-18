import BoltIcon from '@mui/icons-material/Bolt'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useState, useEffect } from 'react'
import useMobileDetect from '~/hooks/useMobileDetect'
//import zap from 'public/sound/zap.wav' // Import your sound effect file

type ClickableIconProps = {
  word: string
  votes: number
}

function ClickableIcon({ word, votes: initialVotes }: ClickableIconProps) {
  const maxClicks = 3
  const [storedValue, setStoredValue] = useState(0)

  const isMobile = useMobileDetect()
  let fontSize: 'medium' | 'large' = isMobile ? 'medium' : 'large'

  useEffect(() => {
    // This code will only run after the component has mounted on the client
    const initialValue = JSON.parse(localStorage.getItem(word) || '0')
    setStoredValue(initialValue)
  }, [word])

  const handleClick = () => {
    let prevCount = JSON.parse(localStorage.getItem(word) || '0')
    if (prevCount < maxClicks) {
      prevCount = prevCount + 1
      localStorage.setItem(word, JSON.stringify(prevCount))
      setStoredValue(prevCount)
    }
  }

  return (
    <>
      <button
        className={`icon cursor-pointer ml-auto relative ${
          isMobile ? 'w-6 h-6' : 'w-10 h-10'
        }`}
        onClick={handleClick}
        type='submit'
        disabled={storedValue >= maxClicks}
      >
        <BoltIcon
          fontSize={fontSize}
          color={maxClicks === storedValue ? 'primary' : 'inherit'}
        />
        <span className='vote-count'>{initialVotes}</span>
      </button>
    </>
  )
}

export default ClickableIcon
