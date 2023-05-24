import Nav from '~/components/Nav'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { redirect, json } from '@remix-run/node'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { useContext } from 'react'
import { badRequest } from '~/utils/request.server'
import { validateUser, validatePassword } from '~/routes/login'
import { Context } from '~/root'
import { getUser, getUserPassword, requireUserId } from '~/utils/session.server'
import bcrypt from 'bcryptjs'

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

  return json({ user })
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

  console.log(`Comparing ${userPassword} to ${hashedPassword}`)

  return redirect('/login?passwordChange=true')
}

const Profile = () => {
  const { theme } = useContext(Context)
  const actionData = useActionData()
  const data = useLoaderData()

  console.log(actionData)

  return (
    <>
      <Nav />
      <div
        className={`flex flex-col items-start text-md pl-10 py-1 mt-12 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <h1 className='text-2xl font-bold'>Profile</h1>
        <Form
          method='post'
          action='/user/profile'
          className='flex flex-col justify-between w-80'
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
              value={data.user.username}
              name='username'
              readOnly
              className={`w-48 px-3 py-2 border-2  rounded-md focus:outline-none focus:border-purple ${
                actionData?.fieldErrors?.user ? 'error-container' : null
              } ${
                theme === 'light'
                  ? 'bg-purple.100 border-secondary.gray'
                  : 'bg-primary.gray border-primary.gray'
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
                  : 'bg-tertiary.black border-primary.gray'
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
                  : 'bg-tertiary.black border-primary.gray'
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
            className={`bg-purple hover:bg-light.purple text-white font-bold py-2 px-4 w-44 rounded-md mb-4 self-end ${
              theme === 'light' ? 'btn-light' : 'btn-dark'
            }`}
          >
            Update
          </button>
        </Form>
      </div>
    </>
  )
}

export default Profile
