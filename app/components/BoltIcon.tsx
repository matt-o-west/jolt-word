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
  const [storedValue, setStoredValue] = useLocalStorage(word, 0)
  //console.log(word) // this is logging correctly
  const isMobile = useMobileDetect()
  let fontSize: 'medium' | 'large' = isMobile ? 'medium' : 'large'

  const handleClick = () => {
    console.log(localStorage.getItem(word)) // this is not logging
    console.log(word) // this is not logging
    setStoredValue((prevCount: number) => {
      if (prevCount < maxClicks) {
        return prevCount + 1
      }
      return prevCount
    })
  }

  return (
    <>
      <button
        className={`icon cursor-pointer ml-auto relative ${
          isMobile ? 'w-6 h-6' : 'w-10 h-10'
        }`}
        onClick={handleClick}
        type='submit'
        disabled={storedValue === maxClicks}
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
