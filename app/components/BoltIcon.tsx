import BoltIcon from '@mui/icons-material/Bolt'
import Skeleton from '@mui/material/Skeleton'
import useMobileDetect from '~/hooks/useMobileDetect'

type ClickableIconProps = {
  word: string
  votes: number | undefined
  handleClick: () => void
  storedValue: number | ((value: Function) => void)
  maxClicks: number
  loading: Boolean
}

function ClickableIcon({
  votes,
  handleClick,
  storedValue,
  maxClicks,
  loading,
}: ClickableIconProps) {
  const isMobile = useMobileDetect()
  let fontSize: 'medium' | 'large' = isMobile ? 'medium' : 'large'

  // I fixed this piece in multiple ways, and then came back later to a commit to find the code was broken again. Hence solution below.
  const parsedVotes = () => {
    if (storedValue === maxClicks) {
      return (votes as number) + 1
    }
    return votes as number
  }

  const digitClassName = () => {
    const votes = parsedVotes()
    if (votes < 10) {
      return 'single-digit'
    } else if (votes >= 10 && votes < 100) {
      return 'double-digit'
    } else if (votes >= 100) {
      return 'triple-digit'
    }
  }
  return (
    <>
      {loading && (
        <Skeleton variant='rectangular' animation='wave'>
          <BoltIcon fontSize={fontSize} />
        </Skeleton>
      )}
      {!loading && (
        <button
          className={`icon cursor-pointer ml-auto relative tablet:mb-1 lgPhone:mb-4 phone:mb-6 ${
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
          <span className={digitClassName()}>{parsedVotes()}</span>
        </button>
      )}
    </>
  )
}

export default ClickableIcon
