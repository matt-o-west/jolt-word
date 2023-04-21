import React from 'react'
import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { requireUserId, getUserId } from '~/utils/session.server'
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

  const userId = await getUserId(request)

  if (userId) {
    const userWords = await db.userWord.findMany({
      where: {
        userId,
      },
    })
    return json({ loggedInUser, userWords })
  }

  return json({ loggedInUser, user })
}

const user = () => {
  return <div>user</div>
}

export default user
