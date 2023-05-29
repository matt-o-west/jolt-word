import { useState, useEffect } from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { Form } from '@remix-run/react'
import type { LeaderBoardType } from './LeaderBoard'
import ClickableIcon from './BoltIcon'

const ActionForm = ({ word, votes }: LeaderBoardType) => {
  const maxClicks = 3
  const [storedValue, setStoredValue] = useLocalStorage<number>(word, 0, 120)
  const [clicks, setClicks] = useState(storedValue as number)

  useEffect(() => {
    if (clicks <= maxClicks) {
      setStoredValue(clicks)
    }
  }, [clicks, setStoredValue])

  const handleClick = () => {
    console.log('votes', votes)
    if (clicks < maxClicks) {
      setClicks(clicks + 1)
    }
  }

  return (
    <Form method='post' action=''>
      <input type='hidden' name='word' value={word} />
      <input type='hidden' name='action' value='vote' />
      <ClickableIcon
        votes={votes}
        word={word}
        handleClick={handleClick}
        storedValue={storedValue}
        maxClicks={maxClicks}
      />
      <button type='submit' className='hidden'>
        Submit
      </button>
    </Form>
  )
}

export default ActionForm
