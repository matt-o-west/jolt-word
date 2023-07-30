import { useState, useEffect, useRef, useContext } from 'react'
import { Link, Form, useSearchParams, useActionData } from '@remix-run/react'
import type { ActionArgs } from '@vercel/remix'
import { badRequest } from '~/utils/request.server'
import { login, createUserSession } from '~/utils/session.server'
import Alert from '@mui/material/Alert'
import { CSSTransition } from 'react-transition-group'
import { Context } from '~/root'
import { Error, isDefinitelyAnError } from '~/components/Error'
import { useRouteError } from '@remix-run/react'
import useMobileDetect from '~/hooks/useMobileDetect'

import { db } from 'prisma/db.server'

export const validateUser = (user: unknown) => {
  if (typeof user !== 'string' || user.length < 3) {
    return 'Username must be at least 3 characters long.'
  }
}

export const validatePassword = (password: string) => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.'
  }
}

export const validateUrl = (url: string) => {
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
      formError: {
        message: 'Form not submitted correctly.',
        timestamp: Date.now().toString(),
      },
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

  const loggedInUser = await login({ username: user, password })

  if (!loggedInUser) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: {
        message: 'Incorrect username or password.',
        timestamp: Date.now().toString(),
      },
    })
  }

  const userExists = await db.user.findUnique({
    where: {
      username: user,
    },
  })

  if (!userExists) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: {
        message: 'This user does not exist.',
        timestamp: Date.now().toString(),
      },
    })
  }

  return createUserSession(loggedInUser.id, redirectTo)
}

const Login = () => {
  const { theme } = useContext(Context)
  const [searchParams] = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)
  const data = useActionData() ?? { fields: {} }
  console.log(data.loggedInUser)
  //password change alert
  const passwordChange = searchParams.get('passwordChange') === 'true'
  const [showPasswordChangeMessage, setShowPasswordChangeMessage] =
    useState(passwordChange)
  const [hasPasswordChange, setHasPasswordChange] = useState(
    Boolean(passwordChange)
  )
  const passwordChangeRef = useRef(null)
  const isMobile = useMobileDetect()

  //success alert
  const registrationSuccess = searchParams.get('registrationSuccess') === 'true'
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(registrationSuccess)
  const [hasSuccess, setHasSuccess] = useState(Boolean(registrationSuccess))
  const successRef = useRef(null)

  //error alert
  const actionData = useActionData() ?? { fields: {} }
  const [hasError, setHasError] = useState(actionData.formError)
  const [showErrorMessage, setShowErrorMessage] = useState(Boolean(hasError))
  const errorRef = useRef(null)

  //google error alert
  const googleFailure = searchParams.get('googleFailure') === 'true'
  const [showGoogleErrorAlert, setShowGoogleErrorAlert] =
    useState(googleFailure)
  const [hasGoogleError, setHasGoogleError] = useState(Boolean(googleFailure))
  const googleErrorRef = useRef(null)

  //demo message alert
  const demoMode = searchParams.get('demo') === 'true'
  const [showDemoMessage, setShowDemoMessage] = useState(demoMode)
  const [hasDemo, setHasDemo] = useState(Boolean(demoMode))
  const demoRef = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    setHasPasswordChange(passwordChange)
  }, [passwordChange])

  useEffect(() => {
    if (passwordChange) {
      setShowPasswordChangeMessage(true)
      const timer = setTimeout(() => {
        setShowPasswordChangeMessage(false)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [passwordChange])

  useEffect(() => {
    setHasSuccess(registrationSuccess)
  }, [registrationSuccess])

  useEffect(() => {
    if (registrationSuccess) {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [registrationSuccess])

  useEffect(() => {
    setHasError(actionData.formError)
  }, [actionData.formError])

  useEffect(() => {
    if (hasError && actionData.formError) {
      setShowErrorMessage(true)
      formRef.current?.reset()
      const timer = setTimeout(() => {
        setShowErrorMessage(false)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [hasError, actionData.formError])

  useEffect(() => {
    setHasGoogleError(googleFailure)
  }, [googleFailure])

  useEffect(() => {
    if (hasGoogleError) {
      setShowGoogleErrorAlert(true)
      const timer = setTimeout(() => {
        setShowGoogleErrorAlert(false)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [hasGoogleError])

  useEffect(() => {
    setHasDemo(demoMode)
  }, [demoMode])

  useEffect(() => {
    if (hasDemo) {
      setShowDemoMessage(true)
      const timer = setTimeout(() => {
        setShowDemoMessage(false)
      }, 4200)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [hasDemo])

  return (
    <div className=' min-h-screen flex items-center justify-center'>
      <div
        className={`${
          theme === 'light' ? 'bg-white' : 'bg-quaternary.black'
        } rounded-lg shadow-md tablet:w-96 phone:w-80 p-6`}
      >
        <h1 className='text-3xl font-bold mb-4 text-secondary-black'>Login</h1>
        {/*replace CSSTransition with Collapse mui transition component*/}
        {hasPasswordChange && (
          <CSSTransition
            in={showPasswordChangeMessage}
            transitionAppear={true}
            timeout={300}
            classNames='alert'
            nodeRef={passwordChangeRef}
            unmountOnExit
          >
            <div ref={passwordChangeRef} className='mb-3'>
              <Alert variant='filled' severity='info' className='mb-3'>
                You changed your password successfully! Please login.
              </Alert>
            </div>
          </CSSTransition>
        )}
        {hasSuccess && (
          <CSSTransition
            in={showSuccessMessage}
            timeout={300}
            classNames='alert'
            nodeRef={successRef}
            unmountOnExit
          >
            <div ref={successRef} className='mb-3'>
              <Alert variant='filled' severity='success' className='mb-3'>
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
              <Alert variant='filled' severity='error' className='mb-3'>
                {actionData.formError?.message}
              </Alert>
            </div>
          </CSSTransition>
        )}
        {hasGoogleError && (
          <CSSTransition
            in={showGoogleErrorAlert}
            timeout={300}
            classNames='alert'
            nodeRef={googleErrorRef}
            unmountOnExit
          >
            <div ref={googleErrorRef} className='mb-3'>
              <Alert variant='filled' severity='error' className='mb-3'>
                We couldn't log you in with Google. Please try again or register
                a new account.
              </Alert>
            </div>
          </CSSTransition>
        )}
        {hasDemo && (
          <CSSTransition
            in={showDemoMessage}
            timeout={300}
            classNames='alert'
            nodeRef={demoRef}
            unmountOnExit
          >
            <div ref={demoRef} className='mb-3'>
              <Alert variant='filled' severity='info' className='mb-3'>
                A demo account is prepared for you. You can login with it,
                create your own account or login with Google.
              </Alert>
            </div>
          </CSSTransition>
        )}
        <Form method='post' action='/login' ref={formRef}>
          <input
            type='hidden'
            className='hidden'
            name='redirectTo'
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <div className='mb-4'>
            <label
              htmlFor='username'
              className={`block mb-2 ${
                theme === 'light' ? 'text-primary.gray' : 'text-secondary.gray'
              }`}
            >
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              className={`w-full px-3 py-2 border-2  rounded-md focus:outline-none focus:border-purple ${
                actionData?.fieldErrors?.user ? 'error-container' : null
              } ${
                theme === 'light'
                  ? 'bg-white border-secondary.gray'
                  : 'bg-tertiary.black border-primary.gray'
              }`}
              required
              defaultValue={actionData?.fields?.username || 'iheartcoding'}
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
            <label
              htmlFor='password'
              className={`block mb-2 ${
                theme === 'light' ? 'text-primary.gray' : 'text-secondary.gray'
              }`}
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:border-purple ${
                actionData?.fieldErrors?.password ? 'error-container' : null
              } ${
                theme === 'light'
                  ? 'bg-white border-secondary.gray'
                  : 'bg-tertiary.black border-primary.gray'
              }`}
              required
              defaultValue={actionData?.fields?.password || 'helloworld'}
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
            className='bg-purple hover:bg-purple.500 text-white font-bold py-2 px-4 w-full rounded-md mb-4'
          >
            Login
          </button>

          <button className='w-full mb-4'>
            <div
              id='g_id_onload'
              data-client_id='422382084562-n8bf6557l1qi5vooldlh9qenj771v8sl.apps.googleusercontent.com'
              data-context='signin'
              data-ux_mode='popup'
              data-login_uri='http://localhost:3000/auth'
            ></div>
            {/*google button with correct width first render, but will not retain on window resize*/}
            <div
              className='g_id_signin'
              data-type='standard'
              data-shape='rectangular'
              data-theme='outline'
              data-text='signin_with'
              data-size='large'
              data-logo_alignment='left'
              data-width={isMobile ? '275' : '335'}
            ></div>
          </button>
        </Form>

        <div className='text-center'>
          <Link
            to='/register'
            className='text-purple hover:text-dark.feature.purple'
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  let errorMessage = 'Unknown error'
  if (isDefinitelyAnError(error)) {
    errorMessage = error.message
  }

  return <Error errorMessage={errorMessage} />
}

export default Login
