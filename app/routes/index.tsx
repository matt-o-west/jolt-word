import { useState } from 'react'

export default function Index() {
  const [font, setFont] = useState('sans-serif')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const updateFont = ({ target }) => {
    setFont(target.value)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  const fontVariants = {
    'sans-serif': 'sans-serif',
    serif: 'serif',
    mono: 'mono',
  }

  const userButton = isLoggedIn ? (
    <button className='border border-gray-300 rounded-md px-2 py-1'>
      <img src='images/avatar.png' alt='avatar' className='h-8 rounded-full' />
    </button>
  ) : (
    <button
      className='bg-gray text-white rounded-md px-2 py-1 ml-2 hover:bg-background'
      onClick={handleLogin}
    >
      Log In
    </button>
  )

  const themeButton = (
    <button
      className='border border-gray-300 rounded-md px-2 py-1 ml-2'
      onClick={toggleDarkMode}
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )

  return (
    <>
      <nav
        className={`flex flex-row justify-between items-center font-${font} text-xs bg-background p-2 m-2`}
      >
        <img src='images/logo.svg' alt='logo' className='h-8 w-8' />

        <div className='flex items-center'>
          {/* put this in a Form component */}
          <select
            className='bg-background border border-gray-300 rounded-md p-2'
            aria-label='font selector'
            onChange={updateFont}
          >
            <option value='sans-serif'>Sans Serif</option>
            <option value='serif'>Serif</option>
            <option value='mono'>Mono</option>
          </select>
          {themeButton}
          {userButton}
        </div>
      </nav>

      <main
        className={`phone:flex-col phone:max-w-315px bg-background p-2 m-2 font-${font}`}
      />
    </>
  )
}
