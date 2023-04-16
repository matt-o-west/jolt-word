import { useState, useEffect, useRef } from 'react'
import { badRequest } from '~/utils/request.server'
import { redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import type { ActionArgs } from '@remix-run/node'
import { Alert } from '@mui/material'
import { CSSTransition } from 'react-transition-group'
import bcrypt from 'bcryptjs'

import { db } from 'prisma/db.server'

const validateUser = (user: unknown) => {
  if (typeof user !== 'string' || user.length < 3) {
    return 'Username must be at least 3 characters long.'
  }
}

const validatePassword = (password: string) => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.'
  }
}

const validateUrl = (url: string) => {
  let urls = ['/', '/login', '/register']
  if (urls.includes(url)) {
    return url
  }
  return '/'
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const user = form.get('username') as string
  const password = form.get('password') as string
  const redirectTo = validateUrl('/login') as string
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  console.log(user, password)

  if (
    typeof user !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Form not submitted correctly.',
    })
  }

  const fields = { user, password }
  const fieldErrors = {
    user: validateUser(user),
    password: validatePassword(password),
  }

  if (fieldErrors.user || fieldErrors.password) {
    return badRequest({ fieldErrors, fields, formError: null })
  }

  const userExists = await db.user.findUnique({
    where: {
      username: user,
    },
  })

  if (userExists) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'User already exists.',
    })
  }

  if (!userExists) {
    await db.user.create({
      data: {
        username: user,
        passwordHash: hashedPassword,
      },
    })
  }

  return redirect('/login?registrationSuccess=true')
}

const Register = () => {
  const actionData = useActionData() || { fields: {} }

  //error alerts
  const [hasError, setHasError] = useState(actionData.formError)
  const [showError, setShowError] = useState(Boolean(hasError))
  const errorRef = useRef(null)

  useEffect(() => {
    setHasError(actionData.formError)
  }, [actionData.formError])

  useEffect(() => {
    if (hasError) {
      setShowError(true)
      const timer = setTimeout(() => {
        setShowError(false)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [hasError])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-tertiary-gray rounded-lg shadow-md w-full md:w-96 p-6'>
        <h1 className='text-3xl font-bold mb-4 text-secondary-black'>
          Register
        </h1>
        {hasError && (
          <CSSTransition
            in={showError}
            timeout={300}
            classNames='alert'
            nodeRef={errorRef}
            unmountOnExit
          >
            <div ref={errorRef} className='mb-3'>
              <Alert variant='outlined' severity='error'>
                {hasError as string}
              </Alert>
            </div>
          </CSSTransition>
        )}
        <Form method='post' action='/register'>
          <div className='mb-4'>
            <label htmlFor='username' className='block mb-2 text-primary-gray'>
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              className={`w-full px-3 py-2 border-2 border-secondary.gray rounded-md focus:outline-none focus:border-purple ${
                actionData?.fieldErrors?.user ? 'error-container' : null
              }`}
              required
              defaultValue={actionData?.fields?.user}
              aria-invalid={Boolean(actionData?.fieldErrors?.user)}
              aria-errormessage={
                actionData?.fieldErrors?.user ? 'username-error' : undefined
              }
            />
            {actionData?.fieldErrors?.user && (
              <p className='form-validation-error'>
                {actionData.fieldErrors.user}
              </p>
            )}
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block mb-2 text-primary-gray'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className={`w-full px-3 py-2 border-2 border-secondary.gray rounded-md focus:outline-none focus:border-purple ${
                actionData?.fieldErrors?.password ? 'error-container' : null
              }`}
              required
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
            />
            {actionData?.fieldErrors?.password && (
              <p className='form-validation-error'>
                {actionData.fieldErrors.password}
              </p>
            )}
          </div>
          <button
            type='submit'
            className='bg-purple hover:bg-light-purple text-white font-bold py-2 px-4 w-full rounded-md mb-4'
          >
            Register
          </button>
        </Form>
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
