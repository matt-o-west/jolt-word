import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { redirect, json } from '@vercel/remix'
import type { ActionArgs, LoaderArgs } from '@vercel/remix'
import { useContext } from 'react'
import { badRequest } from '~/utils/request.server'
import { validateUser, validatePassword } from '~/routes/login'
import { Context } from '~/root'
import { getUser, getUserPassword, requireUserId } from '~/utils/session.server'
import bcrypt from 'bcryptjs'
import { Error, isDefinitelyAnError } from '~/components/Error'
import useMobileDetect from '~/hooks/useMobileDetect'
import { useRouteError } from '@remix-run/react'
import { Alert, AlertTitle } from '@mui/material'

import { db } from 'prisma/db.server'

export const loader = async ({ request }: LoaderArgs) => {
  const redirectTo = '/login'
  const loggedInUser = await requireUserId(request, redirectTo)
  const user = loggedInUser
    ? await db.user.findUnique({
        where: {
          id: loggedInUser,
        },
      })
    : null

  return json({ user, loggedInUser })
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const user = form.get('username')
  const currentPassword = form.get('currentPassword')
  const newPassword = form.get('newPassword')
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword as string, salt)

  console.log(`Comparing ${currentPassword} to ${newPassword}`)

  if (
    typeof user !== 'string' ||
    typeof currentPassword !== 'string' ||
    typeof newPassword !== 'string'
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

  if (currentPassword === newPassword) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: {
        message: 'New password cannot be the same as current password.',
        timestamp: Date.now().toString(),
      },
    })
  }

  const fields = { user, currentPassword, newPassword }
  const fieldErrors = {
    user: validateUser(user),
    currentPassword: validatePassword(currentPassword),
    newPassword: validatePassword(newPassword),
  }

  if (
    fieldErrors.user ||
    fieldErrors.currentPassword ||
    fieldErrors.newPassword
  ) {
    return badRequest({ fieldErrors, fields, formError: null })
  }

  const userRecord = await getUser(request)
  const userPassword = await getUserPassword(request)

  if (
    !userRecord ||
    !userPassword ||
    !(await bcrypt.compare(currentPassword, userPassword))
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: {
        message: 'Invalid current password.',
        timestamp: Date.now().toString(),
      },
    })
  }

  const userExists = await db.user.findUnique({
    where: {
      username: user,
    },
  })

  if (userExists && userPassword !== hashedPassword) {
    await db.user.update({
      where: {
        id: userRecord.id,
      },
      data: {
        username: user,
        passwordHash: hashedPassword,
      },
    })
  }

  return redirect('/login?passwordChange=true')
}

const Profile = () => {
  const { theme } = useContext(Context)
  const isMobile = useMobileDetect()
  const actionData = useActionData()
  const { user } = useLoaderData()

  const googleId = user?.id.startsWith('g#') ? user.id : null
  const demoAccount = user?.username.startsWith('iheartcoding')
  const disabled = googleId || demoAccount

  return (
    <>
      <div
        className={`justify-start items-center text-md py-1 w-full mt-12 flex-grow ${theme} desktop:max-w-2xl desktop:pl-10 tablet:max-w-xl phone:mx-auto phone:max-w-md phone:px-4`}
      >
        <h1 className='font-sans-serif text-2xl'>Profile</h1>
        <Form
          method='post'
          action='/user/profile'
          className='flex flex-col justify-between tablet:w-80 phone:w-full'
        >
          <div className='w-64 mb-8 mt-10'>
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
              value={user.username}
              name='username'
              readOnly
              className={`w-48 px-3 py-2 border-2  rounded-md focus:outline-none focus:border-purple ${
                actionData?.fieldErrors?.user ? 'error-container' : null
              } ${
                theme === 'light'
                  ? 'bg-purple.100 border-secondary.gray'
                  : 'bg-primary.gray border-secondary.gray'
              }`}
              required
              defaultValue={actionData?.fields?.username}
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
              className={`block mb-2  ${
                theme === 'light' ? 'text-primary.gray' : 'text-secondary.gray'
              }`}
            >
              Current Password
            </label>
            <input
              type='password'
              id='currentPassword'
              name='currentPassword'
              className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:border-purple ${
                actionData?.fieldErrors?.password ? 'error-container' : null
              } ${
                theme === 'light'
                  ? 'bg-white border-secondary.gray'
                  : `${
                      disabled
                        ? 'bg-primary.gray border-secondary.gray'
                        : 'bg-tertiary.black'
                    } `
              } ${disabled ? 'bg-primary.gray' : 'bg-tertiary.black'}`}
              required
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
              disabled={disabled}
            />
            {actionData?.fieldErrors?.password && (
              <p className='form-validation-error'>
                {actionData.fieldErrors.password}
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
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              name='newPassword'
              className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:border-purple ${
                actionData?.fieldErrors?.password ? 'error-container' : null
              } ${
                theme === 'light'
                  ? 'bg-white border-secondary.gray'
                  : `${
                      disabled
                        ? 'bg-primary.gray border-secondary.gray'
                        : 'bg-tertiary.black'
                    } `
              } ${disabled ? 'bg-primary.gray' : 'bg-tertiary.black'}`}
              required
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
              disabled={disabled}
            />
            {actionData?.fieldErrors?.password && (
              <p className='form-validation-error'>
                {actionData.fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type='submit'
            className={`bg-purple ${
              !disabled ? 'hover:bg-light.purple' : ''
            } text-white font-bold py-2 px-4 w-44 rounded-md mb-4 self-end ${
              theme === 'light' ? 'btn-light' : 'btn-dark'
            }`}
            disabled={disabled}
          >
            Update
          </button>
        </Form>
        {/*can be refactored into a Warning component later for DRY*/}
        {googleId && (
          <Alert
            severity='warning'
            style={{
              width: isMobile ? 285 : 340,

              margin: 'auto',
              padding: '1rem',
              marginTop: '1rem',
            }}
          >
            <AlertTitle>Warning</AlertTitle>
            You can't change your password here, because you're logged in with
            Google.
          </Alert>
        )}
        {demoAccount && (
          <Alert
            severity='warning'
            style={{
              width: isMobile ? 285 : 340,

              margin: 'auto',
              padding: '1rem',
              marginTop: '1rem',
            }}
          >
            <AlertTitle>Warning</AlertTitle>
            You can't change the password here, because this is a demo account!
          </Alert>
        )}
      </div>
    </>
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

export default Profile
