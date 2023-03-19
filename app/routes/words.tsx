import React from 'react'
import { useState } from 'react'

const Words = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    console.log(searchTerm)
  }

  return (
    <div>
      {' '}
      <form
        onSubmit={handleSearchSubmit}
        className='desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto'
      >
        <div className='flex justify-center rounded-lg bg-tertiary.gray mx-4'>
          <input
            className='flex-row w-full mx-1 py-2 border-gray px-4 bg-tertiary.gray'
            placeholder='Search Dictionary'
            type='text'
            value={searchTerm}
            onChange={handleSearchChange}
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
    </div>
  )
}

export default Words
