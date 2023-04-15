import { useState, useEffect, useRef } from 'react'
import { Link, Form, useSearchParams, useActionData } from '@remix-run/react'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { badRequest } from '~/utils/request.server'
import Alert from '@mui/material/Alert'
import { CSSTransition } from 'react-transition-group'

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
  const user = form.get('username')
  const password = form.get('password')
  const redirectTo = validateUrl('/')

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
      formError: 'This user already exists.',
    })
  }

  const passwordMatches = await db.user.findUnique({
    where: {
      username: user,
    },
    select: {
      passwordHash: true,
    },
  })

  if (password !== passwordMatches?.passwordHash) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Incorrect password.',
    })
  }

  return redirect(redirectTo)
}

const Login = () => {
  const [searchParams] = useSearchParams()
  const registrationSuccess = searchParams.get('registrationSuccess') === 'true'
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(registrationSuccess)
  const [hasSuccess, setHasSuccess] = useState(Boolean(registrationSuccess))

  const actionData = useActionData() ?? { fields: {} }
  const successRef = useRef(null)
  const [hasError, setHasError] = useState(actionData.formError)
  const [showError, setShowError] = useState(Boolean(hasError))
  const errorRef = useRef(null)

  console.log(actionData)

  useEffect(() => {
    setHasSuccess(registrationSuccess)
  }, [registrationSuccess])

  useEffect(() => {
    if (registrationSuccess) {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 2000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [registrationSuccess])

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
    <div className=' min-h-screen flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-md w-full md:w-96 p-6'>
        <h1 className='text-3xl font-bold mb-4 text-secondary-black'>Login</h1>
        {hasSuccess && (
          <CSSTransition
            in={showSuccessMessage}
            timeout={300}
            classNames='alert'
            nodeRef={successRef}
            unmountOnExit
          >
            <div ref={successRef} className='mb-3'>
              <Alert variant='outlined' severity='success' className='mb-3'>
                You registered successfully! Please login.
              </Alert>
            </div>
          </CSSTransition>
        )}
        {hasError && (
          <CSSTransition
            in={showErrorMessage}
            timeout={300}
            classNames='alert'
            nodeRef={errorRef}
            unmountOnExit
          >
            <div ref={errorRef} className='mb-3'>
              <Alert variant='outlined' severity='error' className='mb-3'>
                {actionData.formError}
              </Alert>
            </div>
          </CSSTransition>
        )}
        <Form method='post' action='/login'>
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
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? 'username-error' : undefined
              }
            />
            {actionData?.fieldErrors?.user && (
              <p className='form-validation-error'>
                {actionData.fieldErrors.user}
              </p>
            )}
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
