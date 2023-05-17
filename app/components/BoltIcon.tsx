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
  const [clickCount, setClickCount] = useState(0)
  const [storedValue, setStoredValue] = useLocalStorage(word, 0)
  //const [audio] = useState('/sound/zap.wav')
  //const [animationClass, setAnimationClass] = useState('')
  const isMobile = useMobileDetect()

  let fontSize: 'medium' | 'large' = isMobile ? 'medium' : 'large'

  /*useEffect(() => {
    if (clickCount === maxClicks) {
      setAnimationClass('trigger-animation') // CSS class for the animation
      //audio.play()
    }
  }, [clickCount, audio])*/

  const handleClick = () => {
    setClickCount((prevCount) => {
      if (prevCount < maxClicks) {
        setStoredValue(prevCount + 1)
        console.log(votes)
        return prevCount + 1
      }
      return prevCount
    })
  }

  return (
    <>
      <button
        className={`icon cursor-pointer ml-auto relative ${
          isMobile ? 'w-8 h-8' : 'w-10 h-10'
        }`}
        onClick={handleClick}
        type='submit'
        style={{
          // Style the fill effect based on the number of clicks
          backgroundSize: `100% ${(clickCount / maxClicks) * 100}%`,
        }}
        disabled={clickCount === maxClicks}
      >
        <BoltIcon
          fontSize={fontSize}
          color={maxClicks === clickCount ? 'primary' : 'inherit'}
        />
        <span className='vote-count'>{votes}</span>
      </button>
    </>
  )
}

export default ClickableIcon
