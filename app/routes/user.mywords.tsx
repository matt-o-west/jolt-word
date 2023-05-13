import React from 'react'
import Nav from '~/components/Nav'
import type { LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { requireUserId, getUserId } from '~/utils/session.server'
import { Context } from '~/root'
import { useContext } from 'react'
import BoardCard from '~/components/BoardCard'
import { Form } from '@remix-run/react'
import ClickableIcon from '~/components/BoltIcon'
import type { LeaderBoardType } from '~/components/LeaderBoard'

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
      include: {
        word: true,
      },
      orderBy: {
        word: {
          word: 'asc',
        },
      },
    })
    return json({ loggedInUser, userWords })
  }

  return json({ loggedInUser, user, userWords: [] })
}

const MyWords = () => {
  const { theme } = useContext(Context)
  const { loggedInUser, userWords } = useLoaderData<typeof loader>()

  const actionForm = ({ word, votes }: LeaderBoardType) => {
    return (
      <Form method='post' action=''>
        <input type='hidden' name='word' value={word} />
        <ClickableIcon votes={votes} />
        <button type='submit' className='hidden'>
          Submit
        </button>
      </Form>
    )
  }

  const wordData = userWords.map((word) => {
    return {
      word: word.word.word,
      votes: word.word.votes,
      wordId: word.wordId,
    }
  })

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center text-md p-2 py-1 m-2 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <h1 className='text-2xl font-bold'>My Words</h1>

        {loggedInUser && userWords ? (
          <div
            className={`gap-x-6 justify-center items-center ${theme} mt-12 desktop:grid desktop:grid-cols-2 phone:flex phone:flex-col phone:overflow-y-auto`}
          >
            {wordData.map((word) => {
              return (
                <BoardCard
                  word={word.word}
                  votes={word.votes}
                  width={'w-[300px]'}
                  myWords={true}
                  actionForm={actionForm}
                  key={word.wordId}
                />
              )
            })}
          </div>
        ) : null}
      </main>
    </>
  )
}

export default MyWords
