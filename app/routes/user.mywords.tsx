import Nav from '~/components/Nav'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { requireUserId, getUserId } from '~/utils/session.server'
import { badRequest } from '~/utils/request.server'
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

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const word = form.get('word')

  if (typeof word !== 'string' || word === null) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: {
        message: 'Form not submitted correctly.',
        timestamp: Date.now().toString(),
      },
    })
  }

  const wordObject = await db.word.findUnique({
    where: {
      word: word as string,
    },
  })

  if (!wordObject) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: {
        message: 'Word not found.',
        timestamp: Date.now().toString(),
      },
    })
  }

  const wordId = wordObject.id
  const userId = (await getUserId(request)) as string

  const wordExists = await db.userWord.findUnique({
    where: {
      userId_wordId: {
        wordId,
        userId,
      },
    },
    include: {
      word: true,
    },
  })

  if (wordExists) {
    await db.userWord.delete({
      where: {
        userId_wordId: {
          wordId,
          userId,
        },
      },
    })
  }

  if (!wordExists) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: {
        message: "Word not found in user's saved words.",
        timestamp: Date.now().toString(),
      },
    })
  }

  return json({ message: word })
}

const MyWords = () => {
  const { theme } = useContext(Context)
  const { loggedInUser, userWords } = useLoaderData<typeof loader>()

  const actionForm = ({ word, votes }: LeaderBoardType) => {
    return (
      <Form method='post' action=''>
        <input type='hidden' name='word' value={word} />
        < />
        <button type='submit' className='hidden'>
          Submit
        </button>
      </Form>
    )
  }

  const deleteForm = ({ word, votes }: LeaderBoardType) => {
    return (
      <Form method='post' action='/mywords'>
          <input type='hidden' name='action' value='delete' />
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
                  deleteForm={deleteForm}
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
