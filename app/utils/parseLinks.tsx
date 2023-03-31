import { Link } from '@remix-run/react'
import reactStringReplace from 'react-string-replace'

// check the definition for word links
const parseLinks = (text: string) => {
  const parsedTokens = reactStringReplace(
    text,
    /(\w+) : (\w+)/g,
    (match, i) => <span key={i}>{match}</span>
  )

  return parsedTokens
}

export default parseLinks
