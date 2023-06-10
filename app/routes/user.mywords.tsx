import Nav from '~/components/Nav'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { requireUserId, getUserId } from '~/utils/session.server'
import { badRequest } from '~/utils/request.server'
import { Context } from '~/root'
import { useContext, useState } from 'react'
import BoardCard from '~/components/BoardCard'
import { Form } from '@remix-run/react'
import { styled } from '@mui/system'
import ClearIcon from '@mui/icons-material/Clear'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import AbcIcon from '@mui/icons-material/Abc'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import type { LeaderBoardType } from '~/components/LeaderBoard'

import { db } from 'prisma/db.server'

interface WordDataItem {
  word: string
  votes: number
  wordId: string
}

const ClearWord = styled(ClearIcon)({
  color: 'red',
  cursor: 'pointer',
  margin: '0.2rem 1rem 0 0',
  transition: 'transform 0.06s ease-in-out',
  '&:hover': {
    transform: 'scale(1.2)',
  },
})

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
    const alphaUserWords = await db.userWord.findMany({
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
    const recencyUserWords = await db.userWord.findMany({
      where: {
        userId,
      },
      include: {
        word: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return json({ loggedInUser, alphaUserWords, recencyUserWords })
  }

  return json({ loggedInUser, user, alphaUserWords: [], recencyUserWords: [] })
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const word = form.get('word')
  const actionType = form.get('action')

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

  if (actionType === 'delete') {
    await db.userWord.delete({
      where: {
        userId_wordId: {
          wordId,
          userId,
        },
      },
    })
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(word as string)
    }
  }

  if (actionType === 'vote') {
    await db.word.update({
      where: {
        id: wordId,
      },
      data: {
        votes: {
          increment: 1,
        },
      },
    })
  }

  return json({ message: word })
}

const MyWords = () => {
  const { theme } = useContext(Context)
  const { loggedInUser, alphaUserWords, recencyUserWords } =
    useLoaderData<typeof loader>()
  const [alignment, setAlignment] = useState('alphabetical')

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment)
    }
  }

  const deleteForm = ({ word }: LeaderBoardType) => {
    return (
      <Form method='post' action=''>
        <input type='hidden' name='action' value='delete' />
        <input type='hidden' name='word' value={word} />
        <div className='relative'>
          <ClearWord />
          <button
            type='submit'
            className='absolute inset-0 w-full h-full opacity-0 hover:scale-110'
          />
        </div>
      </Form>
    )
  }

  let wordDataAlpha = alphaUserWords.map((word) => {
    return {
      word: word.word.word,
      votes: word.word.votes,
      wordId: word.wordId,
    }
  })

  let wordDataRecency = recencyUserWords.map((word) => {
    return {
      word: word.word.word,
      votes: word.word.votes,
      wordId: word.wordId,
    }
  })

  let wordData: WordDataItem[] = []

  if (alignment === 'alphabetical') {
    wordData = wordDataAlpha
  } else if (alignment === 'recency') {
    wordData = wordDataRecency
  }

  return (
    <>
      <Nav />
      <main
        className={`flex flex-col justify-center items-center text-md p-2 py-1 m-2 mt-12 ${theme} desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto`}
      >
        <h1 className='text-2xl font-bold'>My Words</h1>
        <ToggleButtonGroup
          color='primary'
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label='Platform'
          className='flex justify-end flex-row w-full mt-12'
        >
          <ToggleButton value='alphabetical'>
            <AbcIcon fontSize='large' className='mx-1' />
          </ToggleButton>
          <ToggleButton value='recency'>
            <AccessTimeFilledIcon className='mx-2' />
          </ToggleButton>
        </ToggleButtonGroup>
        {loggedInUser && alignment ? (
          <div
            className={`gap-x-6 justify-center items-center ${theme} mt-6 desktop:grid desktop:grid-cols-2 phone:flex phone:flex-col phone:overflow-y-auto`}
          >
            {wordData.map(({ word, wordId, votes }) => {
              return (
                <BoardCard
                  word={word}
                  votes={votes}
                  width={'w-[300px]'}
                  myWords={true}
                  deleteForm={deleteForm}
                  key={wordId}
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
