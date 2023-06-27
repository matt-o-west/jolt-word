import { useState, useEffect } from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { Form } from '@remix-run/react'
import type { LeaderBoardType } from './LeaderBoard'
import ClickableIcon from './BoltIcon'

const ActionForm = ({ word, votes }: LeaderBoardType) => {
  const maxClicks = 3
  const [storedValue, setStoredValue, storedWord, loading] =
    useLocalStorage<number>(word, 0, 120)

  useEffect(() => {
    console.log(word, storedWord, storedValue)
    if (word !== storedWord) {
      setStoredValue(0)
    }
  }, [word, storedWord, storedValue])

  const handleClick = () => {
    setStoredValue((prevStoredValue) => {
      if (prevStoredValue < maxClicks) {
        return prevStoredValue + 1
      } else {
        return prevStoredValue
      }
    })
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
        loading={loading}
      />
      <button type='submit' className='hidden'>
        Submit
      </button>
    </Form>
  )
}

export default ActionForm
