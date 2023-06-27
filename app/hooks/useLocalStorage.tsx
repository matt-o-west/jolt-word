import { useState, useEffect } from 'react'

export const useLocalStorage = <T,>(
  word: string,
  initialValue: T,
  expiryInMinutes: number
): [T, (value: T | ((val: T) => T)) => void, String, Boolean] => {
  const [loading, setLoading] = useState(true)
  const [storedValue, setStoredValue] = useState<T>(initialValue) // initial value passed from ActionForm to useLocalStorage

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(word)
      if (item) {
        const data = JSON.parse(item)
        const now = new Date()
        if (now.getTime() < data.expiry) {
          setStoredValue(data.value)
        } else {
          // If the item has expired, set it to the initial value
          setStoredValue(initialValue)
        }
      } else {
        // If the item doesn't exist, set it to the initial value
        setStoredValue(initialValue)
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [word, initialValue])

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

  return [storedValue, setValue, word, loading]
}
