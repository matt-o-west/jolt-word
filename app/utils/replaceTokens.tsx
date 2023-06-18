import React from 'react'
import { Link } from '@remix-run/react'
import reactStringReplace from 'react-string-replace'

const replaceTokens = (text: string) => {
  let parsedTokens = reactStringReplace(
    text,
    /\{b\}(.*?)\{\/b\}/g,
    (match, i) => <strong key={i}>{match}</strong>
  )

  parsedTokens = parsedTokens.map((element, i) => {
    if (
      React.isValidElement(element) &&
      element.type === 'strong' &&
      i < parsedTokens.length - 1
    ) {
      return [element, <span key={i}>{': '}</span>]
    } else {
      return element
    }
  })

  const subscriptTokens = reactStringReplace(
    parsedTokens,
    /\{inf\}(.*?)\{\/inf\}/g,
    (match, i) => ''
  )

  const italicTokens = reactStringReplace(
    subscriptTokens.join(''),
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
    (match, i) => ''
  )

  const crossRefTokens = reactStringReplace(
    linkTokens,
    /\{dx_ety\}see\s+\{dxt\|([^|]+)\|\|\}\{\/dx_ety\}/g,
    (match, i) => (
      <>
        {' '}
        see
        <Link
          to={`/${match.replace(/:\d+$/, '')}`}
          className='text-lowercase link'
          key={i}
        >
          {match.replace(/:\d+$/, '')}
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

  const etLinkTokens = reactStringReplace(
    wiTokens,
    /\{et_link\|([a-z-]+)\|([a-z-]+)\}/g,
    (match, i) => ''
  )

  return etLinkTokens
}

export default replaceTokens
