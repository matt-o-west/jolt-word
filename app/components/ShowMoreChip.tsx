import Chip from '@mui/material/Chip'
import { styled } from '@mui/system'
import { useState } from 'react'
import useMobileDetect from '~/hooks/useMobileDetect'

const StyledChip = styled(Chip)(({ theme, isDarkMode, isVisible }) => ({
  position: 'absolute',
  top: '19rem',
  right: '6rem',
  bottom: theme.spacing(1),
  left: '6rem',
  zIndex: 1,
  backgroundColor: isDarkMode ? '#3a3a3a' : '#fff',
  border: `1px solid ${isDarkMode ? '#e9e9e9' : '#a445ed'}`,
  color: isDarkMode ? '#e9e9e9' : '#a445ed',
  fontWeight: 'bold',
  opacity: isVisible ? 1 : 0,
  transition: 'opacity 0.3s',
  margin: '0 auto',
  width: '40%',

  '&:hover': {
    backgroundColor: isDarkMode ? '#e9e9e9' : '#a445ed',
    borderColor: isDarkMode ? '#e9e9e9' : '#a445ed',
    color: isDarkMode ? '#3a3a3a' : '#fff',
  },
}))

const Overlay = styled('div')(({ isDarkMode, isMobile }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: isMobile ? '44%' : '68%',
  width: '85%',
  margin: '0 auto',
  background: isDarkMode
    ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(58, 58, 58, 1) 100%)'
    : 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
  opacity: 0,
  transition: 'opacity 0.3s',
  '@media (max-width: 1425px)': {
    width: '60%',
  },

  '@media (max-width: 768px)': {
    width: '60%',
  },

  '@media (max-width: 520px)': {
    width: '70%',
  },

  '&:hover': {
    opacity: 0.5,
  },
}))

const ShowMoreChip = ({ isStatic = false, isDarkMode = false }) => {
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useMobileDetect()
  isStatic = isMobile
  console.log(isMobile)

  const handleMouseEnter = () => {
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  if (isMobile) {
    return null // Don't render anything on mobile devices.
  }

  if (isStatic) {
    return (
      <StyledChip
        isVisible={true}
        isDarkMode={isDarkMode}
        label='Show More'
        color='primary'
        variant='filled'
        hidden={true}
        clickable
      />
    )
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='w-auto h-auto'
    >
      <Overlay isDarkMode={isDarkMode} isMobile={isMobile} />
      <StyledChip
        isVisible={isVisible}
        isDarkMode={isDarkMode}
        label='Show More'
        color='primary'
        variant='filled'
        clickable
      />
    </div>
  )
}

export default ShowMoreChip
