import { useState } from 'react'

export default function Index() {
  const [font, setFont] = useState('sans-serif')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const updateFont = ({ target }) => {
    setFont(target.value)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    console.log(searchTerm)
  }

  const fontVariants = {
    'sans-serif': 'sans-serif',
    serif: 'serif',
    mono: 'mono',
  }

  const userButton = isLoggedIn ? (
    <button className='border border-none rounded-md px-2 py-1'>
      <img src='images/avatar.png' alt='avatar' className='h-8 rounded-full' />
    </button>
  ) : (
    <button
      className='bg-gray text-primary.black rounded-md px-2 py-1 ml-2 hover:bg-background'
      onClick={handleLogin}
    >
      Log In
    </button>
  )

  const themeButton = (
    <button className='rounded-md px-2 py-1 ml-2' onClick={toggleDarkMode}>
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )

  return (
    <>
      <nav
        className={`flex flex-row justify-between items-center font-${font} text-xs p-2 py-8 m-2 desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <img src='images/logo.svg' alt='logo' className='h-8 w-8 ml-1' />

        <div className='flex items-center'>
          {/* put this in a Form component */}
          <div className=' border-r-2'>
            <select
              className='p-0.5 mr-3 pr-2 border-none select'
              aria-label='font selector'
              onChange={updateFont}
            >
              <option value='sans-serif'>Sans Serif</option>
              <option value='serif'>Serif</option>
              <option value='mono'>Mono</option>
            </select>
          </div>
          {themeButton}
          {userButton}
        </div>
      </nav>
      <form
        onSubmit={handleSearchSubmit}
        className='desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto'
      >
        <div className='flex justify-center rounded-lg bg-tertiary.gray mx-4'>
          <input
            className='flex-row w-full mx-1 py-2 border-gray px-4 bg-tertiary.gray'
            placeholder='Search Dictionary'
          />
          <div className='relative inset-y-0 right-0 flex items-center pl-2 mr-4'>
            <button type='submit'>
              <img
                src='images/icon-search.svg'
                alt='search'
                className='h-4 w-4'
              />
            </button>
          </div>
        </div>
      </form>
      <main
        className={`phone:flex-col phone:max-w-315px p-2 m-2 font-${font}`}
      />
    </>
  )
}
