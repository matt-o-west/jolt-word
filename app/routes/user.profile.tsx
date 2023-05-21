import Nav from '~/components/Nav'
import { Form, useActionData } from '@remix-run/react'
import { redirect } from '@remix-run/node'
import type { ActionArgs } from '@remix-run/node'
import { useContext } from 'react'
import { badRequest } from '~/utils/request.server'
import { validateUser, validatePassword } from '~/routes/login'
import { Context } from '~/root'

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const user = form.get('username')
  const currentPassword = form.get('current-password')
  const newPassword = form.get('new-password')

  if (
    typeof user !== 'string' ||
    typeof currentPassword !== 'string' ||
    newPassword !== 'string'
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

  return redirect('/login')
}

const Profile = () => {
  const { theme } = useContext(Context)
  const actionData = useActionData()

  return (
    <>
      <Nav />
      <div
        className={`flex flex-col justify-center items-center text-md py-1 mt-12 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <h1>Profile</h1>
        <Form action='/user/profile'>
          <div className='mb-8'>
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
              className={`block mb-2 ${
                theme === 'light' ? 'text-primary.gray' : 'text-secondary.gray'
              }`}
            >
              Current Password
            </label>
            <input
              type='password'
              id='current-password'
              name='current-password'
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
              id='new-password'
              name='new-password'
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
            className={`btn btn-primary ${
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
