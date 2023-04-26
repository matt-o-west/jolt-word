import Chip from '@mui/material/Chip'
import { styled } from '@mui/system'
import { useState } from 'react'

const StyledChip = styled(Chip)`
  position: absolute;
  top: 19rem;
  right: 6rem;
  bottom: ${({ theme }) => theme.spacing(1)};
  left: 7rem;
  z-index: 1;
  background-color: #fff;
  border: 1px solid #a445ed;
  color: #a445ed;
  font-weight: bold;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s;
`

const Overlay = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 500px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`

const ShowMoreChip = () => {
  const [isVisible, setIsVisible] = useState(false)

  const handleMouseEnter = () => {
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <>
      <Overlay
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <StyledChip
        isVisible={isVisible}
        label='Show More'
        color='primary'
        variant='filled'
        clickable
      />
    </>
  )
}

export default ShowMoreChip
