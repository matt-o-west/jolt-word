import { useRef, useEffect } from 'react'

interface ParallaxProps {
  imageUrl: string
  children?: React.ReactNode
}

const Parallax: React.FC<ParallaxProps> = ({ imageUrl, children }) => {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollPosition = window.pageYOffset
        parallaxRef.current.style.backgroundPositionY =
          scrollPosition * 0.5 + 'px'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={parallaxRef}
      className='parallax-container'
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className='content'>{children}</div>
    </div>
  )
}

export default Parallax
