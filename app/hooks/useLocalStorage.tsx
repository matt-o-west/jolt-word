import { useState, useEffect } from 'react'

export const useLocalStorage = (
  word: string,
  initialValue: number,
  expiryInMinutes: number
) => {
  const [storedValue, setStoredValue] = useState(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(word)
      // Check if item exists and hasn't expired
      if (item) {
        const data = JSON.parse(item)
        const now = new Date()
        // If the current time is beyond the expiry time, return initialValue
        if (now.getTime() > data.expiry) {
          window.localStorage.removeItem(word)
          setStoredValue(initialValue)
        } else {
          setStoredValue(data.value)
        }
      } else {
        setStoredValue(initialValue)
      }
    } catch (error) {
      console.log(error)
      setStoredValue(initialValue)
    }
  }, [word, initialValue, expiryInMinutes])

  const setValue = (value: Function) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      // Create expiry date from now
      const now = new Date()
      const expiry = now.getTime() + expiryInMinutes * 60 * 1000
      // Save to local storage
      window.localStorage.setItem(
        word,
        JSON.stringify({ value: valueToStore, expiry })
      )
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
