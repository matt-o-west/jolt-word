import { useState, useEffect } from 'react'

export const useLocalStorage = <T,>(
  word: string,
  initialValue: T,
  expiryInMinutes: number
): [T, (value: T | ((val: T) => T)) => void] => {
  console.log(initialValue + ' ' + expiryInMinutes)

  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(word)
      // Check if item exists and hasn't expired
      if (item) {
        const data = JSON.parse(item)
        const now = new Date()
        // If the current time is beyond the expiry time, return initialValue
        if (now.getTime() > data.expiryInMinutes) {
          window.localStorage.removeItem(word)
          setStoredValue(initialValue)
        } else {
          setStoredValue(data.value)
        }
      }
    } catch (error) {
      console.log(error)
      setStoredValue(initialValue)
    }
  }, [word, initialValue, expiryInMinutes])

  const setValue = (value: T | ((val: T) => T)) => {
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
