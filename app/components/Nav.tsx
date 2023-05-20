import { useState, useContext } from 'react'
import { Link } from '@remix-run/react'
import { Context } from '~/root'
import Autocomplete from '~/components/Autocomplete'
import DropdownMenu from './DropdownMenu'

const Nav = () => {
  const { font, theme, featureTheme, toggleTheme, user, setFont, setTheme } =
    useContext(Context)
  const [searchTerm, setSearchTerm] = useState('')
  const [matchingWords, setMatchingWords] = useState<string[]>([])

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchTerm = event.target.value
    setSearchTerm(searchTerm)

    if (searchTerm.length > 2) {
      // not sure why, but getWord from dictionary.server.ts doesn't work here, says it is not a function even though the import looks correct
      const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=42bce219-5d4d-4186-8ab7-f8389ef2e3d0`
      const response = await fetch(url)
      const data = await response.json()
      //console.log(data)

      if (Array.isArray(data) && typeof data[0] === 'string') {
        setMatchingWords(data)
        return data
      } else if (Array.isArray(data) && typeof data[0] !== 'string') {
        //console.log(data[0].hwi?.hw)
        setMatchingWords(data)
        return [data[0].hwi?.hw]
      }
    }
  }

  const userButton = user ? (
    <DropdownMenu />
  ) : (
    <button className='bg-gray text-primary.black rounded-md px-2 py-1 ml-2 hover:bg-background'>
      <Link to='/login'>Log In</Link>
    </button>
  )

  const themeButton = (
    <label className='relative inline-flex items-center cursor-pointer ml-4'>
      <input
        type='checkbox'
        value=''
        className={`sr-only peer`}
        onChange={setTheme}
      />
      <div
        className={`w-11 h-6 ${toggleTheme} peer-focus:outline-none peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}
      />
      <span className='ml-3'>
        <svg
          className={`h-4 w-4`}
          xmlns='http://www.w3.org/2000/svg'
          width='22'
          height='22'
          viewBox='0 0 22 22'
        >
          <path
            fill='none'
            stroke={featureTheme === 'feature-dark' ? '#a445ed' : '#757575'}
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z'
          />
        </svg>
      </span>
    </label>
  )

  /*const fontSelect = (
    <div className='flex flex-row border-r-2'>
      <select
        className={`${theme} p-0.5 mr-2 pr-2 border-none outline-none select text-end`}
        aria-label='font selector'
        onChange={setFont}
      >
        <option value='sans-serif'>Sans Serif</option>
        <option value='serif'>Serif</option>
        <option value='mono'>Mono</option>
      </select>
    </div>
  )*/

  return (
    <>
      <nav
        className={`flex flex-row justify-between items-center font-${font} text-xs p-2 py-8 m-2 desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <Link to='/'>
          <img src='/images/logo.svg' alt='logo' className='h-8 w-8 ml-1' />
        </Link>
        <div className='flex items-center'>
          {/*fontSelect*/}
          {themeButton}
          {userButton}
        </div>
      </nav>
      <form className='desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto'>
        <div
          className={`${featureTheme} flex justify-center rounded-lg bg-tertiary.gray mx-4`}
        >
          <input
            className={`${featureTheme} flex-row w-full mx-1 py-2 border-gray px-4 bg-tertiary.gray outline-purple`}
            placeholder='Search Dictionary'
            value={searchTerm}
            onChange={handleInputChange}
          />
          <div className='relative inset-y-0 right-0 flex items-center pl-2 mr-4'>
            <button type='submit'>
              <img
                src='/images/icon-search.svg'
                alt='search'
                className='h-4 w-4'
              />
            </button>
          </div>
        </div>
      </form>
      <Autocomplete matchingWords={matchingWords} />
    </>
  )
}

export default Nav
