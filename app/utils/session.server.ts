import { createCookieSessionStorage, redirect } from '@remix-run/node'
import bcrypt from 'bcryptjs'
import cron from 'node-cron'
import { db } from 'prisma/db.server'

// Run the task every day at 12:00 AM.
const schedule = '0 0 * * *'

const task = async () => {
  const dateLimit = new Date()
  dateLimit.setSeconds(dateLimit.getSeconds() - 10)
  const userWords = await db.userWord.findMany({
    where: {
      createdAt: {
        lte: dateLimit,
      },
    },
  })

  for (const userWord of userWords) {
    console.log('Processing userWord', userWord)
    const word = await db.word.findUnique({
      where: {
        id: userWord.wordId,
      },
    })
    if (word) {
      console.log('Updating word', word)
      await db.word.update({
        where: {
          id: userWord.wordId,
        },
        data: {
          votes: Math.max(0, word.votes - 1),
        },
      })
    }
  }
  console.log('Task completed')
}

cron.schedule(schedule, task)

type LoginForm = {
  username: string
  password: string
}

export const login = async ({ username, password }: LoginForm) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  })
  if (!user) {
    return null
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return null
  }

  return { id: user.id, username: user.username }
}

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: process.env.SESSION_COOKIE_NAME || '__session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE) || 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') return null
  return userId
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    return null
  }
  return userId
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    })
    return user
  } catch {
    throw logout(request)
  }
}

export async function getUserPassword(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    })
    return user ? user.passwordHash : null
  } catch {
    throw logout(request)
  }
}

export async function getUserName(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') {
    return null
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { username: true },
    })
    return user ? user.username : null
  } catch {
    throw logout(request)
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}
