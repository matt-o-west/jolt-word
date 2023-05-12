import BoltIcon from '@mui/icons-material/Bolt'
import { is } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import useMobileDetect from '~/hooks/useMobileDetect'
//import zap from 'public/sound/zap.wav' // Import your sound effect file

function ClickableIcon({ votes }) {
  const maxClicks = 10
  const [clickCount, setClickCount] = useState(0)
  const [animationClass, setAnimationClass] = useState('')
  const [audio] = useState('/sound/zap.wav')

  const isMobile = useMobileDetect()

  let fontSize: 'medium' | 'large' = isMobile ? 'medium' : 'large'

  console.log(votes)

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
    <>
      <button
        className={`icon ${animationClass} cursor-pointer ml-auto relative tablet:mb-1 phone:mb-4 ${
          isMobile ? 'w-8 h-8' : 'w-10 h-10'
        }}`}
        onClick={handleClick}
        type='submit'
        style={{
          // Style the fill effect based on the number of clicks
          backgroundSize: `100% ${(clickCount / maxClicks) * 100}%`,
        }}
      >
        <BoltIcon name='bolt' fontSize={fontSize} />

        <span className='vote-count'>{votes}</span>
      </button>
    </>
  )
}

export default ClickableIcon
