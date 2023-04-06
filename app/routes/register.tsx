import React from 'react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const Register = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-tertiary-gray rounded-lg shadow-md w-full md:w-96 p-6'>
        <h1 className='text-3xl font-bold mb-4 text-secondary-black'>
          Register
        </h1>
        <form>
          <div className='mb-4'>
            <label htmlFor='username' className='block mb-2 text-primary-gray'>
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              className='w-full px-3 py-2 border-2 border-secondary-gray rounded-md focus:outline-none focus:border-purple'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block mb-2 text-primary-gray'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className='w-full px-3 py-2 border-2 border-secondary-gray rounded-md focus:outline-none focus:border-purple'
              required
            />
          </div>
          <button
            type='submit'
            className='bg-purple hover:bg-light-purple text-white font-bold py-2 px-4 w-full rounded-md mb-4'
          >
            Register
          </button>
        </form>
        <div className='text-center'>
          <a href='/login' className='text-purple hover:text-light-purple'>
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default Register
