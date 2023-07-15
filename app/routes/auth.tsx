import { OAuth2Client } from 'google-auth-library'
import type { ActionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { createUserSession } from '~/utils/session.server'
import { db } from 'prisma/db.server'

export interface GoogleUser {
  id: string
  email: string
  email_verified?: boolean
  given_name?: string
  family_name?: string
  picture?: string
}

const id = process.env.GOOGLE_CLIENT_ID
const secret = process.env.GOOGLE_CLIENT_SECRET
const client = new OAuth2Client(id, secret)

export const hasGoogleCookie = (request: Request) => {
  const cookie = request.headers.get('Cookie')?.split(';') ?? []
  console.log(cookie)
  return cookie.some(
    (c: string) =>
      c.trim().startsWith('g_csrf_token') || c.trim().startsWith('g_state')
  )
}

export const verify = async (request: Request): Promise<GoogleUser> => {
  console.log('Verify function called')
  const form = await request.formData()
  const token = form.get('credential')?.toString() ?? undefined
  if (!token) {
    throw new Error('Credential does not exist, login failed.')
  }

  let ticket
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        '422382084562-n8bf6557l1qi5vooldlh9qenj771v8sl.apps.googleusercontent.com',
    })
    console.log(ticket)
  } catch (err) {
    console.error('Error verifying token:', err)
    throw err
  }

  const payload = ticket.getPayload()
  if (!payload) {
    throw new Error('Payload does not exist.')
  }

  console.log(payload)
  return {
    id: `g#${payload.sub}`,
    email: payload.email ?? '',
    email_verified: payload.email_verified ?? false,
    given_name: payload.given_name ?? '',
    family_name: payload.family_name ?? '',
    picture: payload.picture ?? '',
  }
}

export const action = async ({ request }: ActionArgs) => {
  console.log('Action function called')
  console.log('Google cookie:', hasGoogleCookie(request))
  const redirectTo = '/'

  let user: GoogleUser | undefined = undefined
  if (hasGoogleCookie(request)) {
    console.log('Cookie exists, calling verify')
    user = await verify(request)
    console.log(user)
    const existingUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!existingUser) {
      const newUser = await db.user.create({
        data: {
          id: user.id,
          username: user.given_name ?? user.email,
        },
      })
      return createUserSession(newUser.id, redirectTo)
    }

    return createUserSession(user.id, redirectTo)
  }

  return redirect('/login?googleFailure=true')
}

const Auth = () => {
  return null
}

export default Auth
