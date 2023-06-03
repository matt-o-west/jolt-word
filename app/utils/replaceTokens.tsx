import { Link } from '@remix-run/react'
import reactStringReplace from 'react-string-replace'

const replaceTokens = (text: string) => {
  const parsedTokens = reactStringReplace(
    text,
    /\{b\}(.*?)\{\/b\}/g,
    (match, i) => <strong key={i}>{match}</strong>
  ).map((element, i) => {
    if (element.type === 'strong' && i < parsedTokens.length - 1) {
      return [element, <span key={i}>{': '}</span>]
    } else {
      return element
    }
  })

  const subscriptTokens = reactStringReplace(
    parsedTokens,
    /\{inf\}(.*?)\{\/inf\}/g,
    (match, i) => <sub key={i}>{match}</sub>
  )

  const italicTokens = reactStringReplace(
    subscriptTokens,
    /\{it\}(.*?)\{\/it\}/g,
    (match, i) => <i key={i}>{match}</i>
  )

  const leftDoubleQuoteTokens = reactStringReplace(
    italicTokens,
    /\{ldquo\}/g,
    (match, i) => <span key={i}>&ldquo;</span>
  )

  const rightDoubleQuoteTokens = reactStringReplace(
    leftDoubleQuoteTokens,
    /\{rdquo\}/g,
    (match, i) => <span key={i}>&rdquo;</span>
  )

  const smallCapsTokens = reactStringReplace(
    rightDoubleQuoteTokens,
    /\{sc\}(.*?)\{\/sc\}/g,
    (match, i) => (
      <span style={{ fontVariant: 'small-caps' }} key={i}>
        {match}
      </span>
    )
  )

  const superscriptTokens = reactStringReplace(
    smallCapsTokens,
    /\{sup\}(.*?)\{\/sup\}/g,
    (match, i) => <sup key={i}>{match}</sup>
  )

  const matrixTokens = reactStringReplace(
    superscriptTokens,
    /\{ma\}(.*?)\{\/ma\}/g,
    (match, i) => <span key={i}></span>
  )

  const linkTokens = reactStringReplace(
    matrixTokens,
    /\{et_link\|([^:]+):\d+\|[^:]+:\d+\}/g,
    (match, i) => (
      <Link
        to={`/${match.split(':')[0]}`}
        className='text-lowercase link'
        key={i}
      >
        {match.split(':')[0]}
      </Link>
    )
  )

  const crossRefTokens = reactStringReplace(
    linkTokens,
    /\{dx_ety\}see\s+\{dxt\|([^|]+)\|\|\}\{\/dx_ety\}/g,
    (match, i) => (
      <>
        {' '}
        see
        <Link to={`/${match}`} className='text-lowercase link' key={i}>
          {match}
        </Link>
      </>
    )
  )

  const wiTokens = reactStringReplace(
    crossRefTokens,
    /\{wi\}(.*?)\{\/wi\}/g,
    (match, i) => (
      <span className='italic font-lg' key={i}>
        {match}
      </span>
    )
  )

  return wiTokens
}

export default replaceTokens
