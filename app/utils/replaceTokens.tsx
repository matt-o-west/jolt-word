import { Link } from '@remix-run/react'
import reactStringReplace from 'react-string-replace'

const replaceTokens = (text: string) => {
  console.log(text)
  const parsedTokens = reactStringReplace(
    text,
    /\{sc\}(.*?)\{\/sc\}/g,
    (match, i) => (
      <Link to={`/${match}`} className='link' key={i}>
        {match}
      </Link>
    )
  )
  console.log(parsedTokens)

  return parsedTokens
}

export default replaceTokens
