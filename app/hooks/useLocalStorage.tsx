import { useState, useEffect } from 'react'

export const useLocalStorage = (word: string, initialValue: number) => {
  const [storedValue, setStoredValue] = useState(initialValue)

  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(word)
      // Parse stored json or if none return initialValue
      const value = item ? JSON.parse(item) : initialValue
      setStoredValue(value)
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      setStoredValue(initialValue)
    }
  }, [word, initialValue])

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: Function) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(word, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
