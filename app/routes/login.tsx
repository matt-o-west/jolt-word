import React from 'react'
import { Link, Form, useSearchParams, useActionData } from '@remix-run/react'
import type { ActionArgs, LinksFunction } from '@remix-run/node'

import { db } from 'prisma/db.server'

const validateUser = (user: unknown) => {
  if (typeof user !== 'string' || user.length < 3) {
    return 'Username must be at least 3 characters long.'
  }
}

const validatePassword = (password: string) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }
}

const Login = () => {
  const [searchParams] = useSearchParams()

  return (
    <div className='bg-tertiary.gray min-h-screen flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-md w-full md:w-96 p-6'>
        <h1 className='text-3xl font-bold mb-4 text-secondary-black'>Login</h1>
        <Form>
          <input
            type='hidden'
            className='hidden'
            name='redirectTo'
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <div className='mb-4'>
            <label htmlFor='username' className='block mb-2 text-primary.gray'>
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              className='w-full px-3 py-2 border-2 border-secondary.gray rounded-md focus:outline-none focus:border-purple'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block mb-2 text-primary.gray'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className='w-full px-3 py-2 border-2 border-secondary.gray rounded-md focus:outline-none focus:border-purple'
              required
            />
          </div>
          <button
            type='submit'
            className='bg-purple hover:bg-light.purple text-white font-bold py-2 px-4 w-full rounded-md mb-4'
          >
            Login
          </button>
        </Form>
        <button
          type='button'
          className='bg-red hover:bg-opacity-80 text-white font-bold py-2 px-4 w-full rounded-md mb-4'
        >
          <i className='fab fa-google'></i> Sign in with Google (placeholder)
        </button>
        <div className='text-center'>
          <Link to='/register' className='text-purple hover:text-light.purple'>
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
