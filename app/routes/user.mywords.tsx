import React from 'react'
import Nav from '~/components/Nav'
import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { requireUserId, getUserId } from '~/utils/session.server'
import { Context } from '~/root'
import { useContext } from 'react'
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

  return json({ loggedInUser, user, userWords: null })
}

const MyWords = () => {
  const { theme } = useContext(Context)
  const { loggedInUser, userWords } = useLoaderData<typeof loader>()

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center text-md p-2 py-1 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <h1 className='text-2xl font-bold'>My Words</h1>
        {loggedInUser && userWords ? (
          <div className='flex flex-col justify-center items-center'>
            {userWords.map((word) => {
              return (
                <div
                  className='flex flex-col justify-center items-center'
                  key={word.wordId}
                >
                  <h2 className='text-xl font-bold'>{word.createdAt}</h2>
                  <p className='text-md font-bold'>{word.wordId}</p>
                </div>
              )
            })}
          </div>
        ) : null}
      </main>
    </>
  )
}

export default MyWords
