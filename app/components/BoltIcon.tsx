import BoltIcon from '@mui/icons-material/Bolt'
import { useState, useEffect } from 'react'
import zap from 'public/sound/zap.wav' // Import your sound effect file

function ClickableIcon() {
  const maxClicks = 5
  const [clickCount, setClickCount] = useState(0)
  const [animationClass, setAnimationClass] = useState('')
  const [audio] = useState('/sound/zap.wav')

  useEffect(() => {
    if (clickCount === maxClicks) {
      setAnimationClass('trigger-animation') // CSS class for the animation
      //audio.play()
    }
  }, [clickCount, audio])

  const handleClick = () => {
    if (clickCount < maxClicks) {
      setClickCount((prevCount) => prevCount + 1)
    }
  }

  return (
    <div
      className={`icon ${animationClass}`}
      onClick={handleClick}
      style={{
        // Style the fill effect based on the number of clicks
        backgroundSize: `100% ${(clickCount / maxClicks) * 100}%`,
      }}
    >
      <BoltIcon name='bolt' />
    </div>
  )
}

export default ClickableIcon
