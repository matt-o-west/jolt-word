import React from 'react'
import { Link } from '@remix-run/react'
import reactStringReplace from 'react-string-replace'

const replaceInElements = (elements, regex, replaceFunc) => {
  elements = Array.isArray(elements) ? elements : [elements]

  return elements.flatMap((element, i) => {
    if (React.isValidElement(element)) {
      return React.cloneElement(
        element,
        { key: i },
        replaceInElements(
          React.Children.toArray(element.props.children),
          regex,
          replaceFunc
        )
      )
    } else if (typeof element === 'string') {
      return reactStringReplace(element, regex, replaceFunc)
    } else {
      return element
    }
  })
}

const replaceTokens = (text) => {
  let parsedTokens = [text]
  let prevLength = 0

  while (parsedTokens.length !== prevLength) {
    prevLength = parsedTokens.length

    parsedTokens = replaceInElements(
      text,
      /\{b\}(.*?)\{\/b\}/g,
      (match: string, i: number) => <strong key={i}>{match}</strong>
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{inf\}(.*?)\{\/inf\}/g,
      (match: string, i: number) => <sub key={i}>{match}</sub>
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{it\}(.*?)\{\/it\}/g,
      (match: string, i: number) => <i key={i}>{match}</i>
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{inf\}(.*?)\{\/inf\}/g,
      (match: string, i: number) => {
        return <sub key={i}>{match}</sub>
      }
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{it\}(.*?)\{\/it\}/g,
      (match: string, i: number) => <i key={i}>{match}</i>
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{ldquo\}/g,
      (match: string, i: number) => <span key={i}>&ldquo;</span>
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{rdquo\}/g,
      (match: string, i: number) => <span key={i}>&rdquo;</span>
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{sc\}(.*?)\{\/sc\}/g,
      (match: string, i: number) => (
        <span style={{ fontVariant: 'small-caps' }} key={i}>
          {match}
        </span>
      )
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{sup\}(.*?)\{\/sup\}/g,
      (match: string, i: number) => <sup key={i}>{match}</sup>
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{ma\}(.*?)\{\/ma\}/g,
      (match: string, i: number) => <span key={i}></span>
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{et_link\|([^|]+):\d+\|[^|]+:\d+\}/g,
      (match: string, i: number) => ''
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{dx_ety\}see\s+\{dxt\|([^|]+)\|\|\}\{\/dx_ety\}/g,
      (match: string, i: number) => (
        <>
          {' '}
          see
          <Link to={`/${match}`} className='text-lowercase link' key={i}>
            {match.replace(/:\d+$/, '')}
          </Link>
        </>
      )
    )

    parsedTokens = replaceInElements(
      parsedTokens,
      /\{wi\}(.*?)\{\/wi\}/g,
      (match: string, i: number) => (
        <span className='italic font-lg' key={i}>
          {match}
        </span>
      )
    )
  }

  return parsedTokens
}

export default replaceTokens
