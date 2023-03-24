import { Link } from '@remix-run/react'

type Result =
  | string
  | string[]
  | undefined
  | {
      hwi?: {
        hw?: string
      }
    }

const Autocomplete = ({ matchingWords }) => {
  if (typeof matchingWords === 'string') {
    // Handle case where matchingWords is a string
    return (
      <Link
        to={`/words/${matchingWords}`}
        className='text-2xl font-bold text-purple transition-all duration-250 hover:scale-110 '
      >
        {matchingWords}
      </Link>
    )
  } else if (Array.isArray(matchingWords)) {
    // Handle case where matchingWords is an array
    return (
      <div className='flex flex-col justify-center items-center text-md p-2 py-8 m-2 desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto'>
        {matchingWords
          .map((word, i) => {
            // Check if current word is different from previous word
            const prevWord = i > 0 ? matchingWords[i - 1] : null
            const prevWordText =
              typeof prevWord === 'string' ? prevWord : prevWord?.hwi?.hw
            if (typeof word === 'string' && word !== prevWordText) {
              return (
                <Link
                  key={word}
                  to={`/words/${word}`}
                  className='text-2xl font-bold text-purple transition-all duration-250 hover:scale-110 '
                >
                  {word}
                </Link>
              )
            } else if (
              typeof word === 'object' &&
              word.hwi?.hw !== prevWordText
            ) {
              return (
                <Link
                  key={word.meta?.uuid}
                  to={`/words/${word.meta?.id}`}
                  className='text-2xl font-bold text-purple transition-all duration-250 hover:scale-110 '
                >
                  {word.meta?.id}
                </Link>
              )
            } else {
              return null // Don't render duplicate word
            }
          })
          .slice(0, 5)}
      </div>
    )
  } else {
    // Handle case where matchingWords is not a string or an array
    return null
  }
}

export default Autocomplete
