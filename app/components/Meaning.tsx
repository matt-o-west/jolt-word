import React from 'react'
import type { DefinitionType } from '~/routes/$word'
import type { Definition } from '~/routes/$word'
import replaceTokens from '~/utils/replaceTokens'
import { Link } from '@remix-run/react'
import { useContext } from 'react'
import { Context } from '~/root'
interface Props {
  meaning: Definition
}

type Synonym = string[][] | undefined

type SynonymType = Synonym | undefined

const Meaning = ({ meaning }: Props) => {
  const { featureTheme } = useContext(Context)
  console.log(featureTheme)

  const synonyms: SynonymType = meaning?.syns?.[0]?.pt

  // check if there are synonyms and format their tokens if so
  const checkSynonyms = () => {
    if (!synonyms) {
      return null
    }

    if (synonyms) {
      console.log(synonyms)
      const formattedText = synonyms
        .slice(0, 4)
        .filter((arr) => arr[0] === 'text')
        .map((synonym, i) => {
          return replaceTokens(synonym[1]).map((word, i) => {
            if (typeof word === 'string') {
              return (
                <span className='text-lowercase' key={i}>
                  {word}
                </span>
              )
            }

            return (
              <Link
                to={`/${word.props.children}`}
                className='text-lowercase link'
                key={i}
              >
                {word.props.children}
              </Link>
            )
          })
        })
      // join the strings with a space

      return <span>{formattedText}</span>
    }
    return null
  }

  const checkLinks = (def: string) => {
    const words = def?.split(' ')
    if (!words) return null // handle empty words array

    const lastWord = words[words.length - 1]
    const colonOneWord = words[words.length - 2] === ':'

    const secondLastWord = words[words.length - 2]
    const colonTwoWords = words[words.length - 3] === ':'

    const removeCommaFromLink = (word: string) => {
      if (word[word.length - 1] === ',') {
        return word.slice(0, word.length - 1)
      }
      return word
    }

    const parsedWords = words.map((word, i) => {
      if (colonOneWord && i === words.length - 1) {
        return (
          <Link to={`/${lastWord}`} className='link' key={i}>
            {lastWord}
          </Link>
        )
      } else if (colonTwoWords && i === words.length - 2) {
        return (
          <>
            <Link
              to={`/${removeCommaFromLink(secondLastWord)}`}
              className='link'
              key={i}
            >
              {removeCommaFromLink(secondLastWord)}
            </Link>
            <span>, </span>
            <Link to={`/${lastWord}`} className='link' key={i}>
              {lastWord}
            </Link>
          </>
        )
      } else {
        if (colonTwoWords && i === words.length - 1) {
          return null
        }
        return <span key={i}>{word} </span>
      }
    })

    return <>{parsedWords}</>
  }

  // check if shortdef arrays and format their children if they exist
  const checkShortdef = (meaning: Definition) => {
    const def = meaning?.shortdef?.[0]
    if (Array.isArray(meaning?.shortdef)) {
      return def
    }
    return null
  }

  return (
    <div className='mt-6'>
      <span className='italic font-sans-serif text-xl'>{meaning?.fl}</span>
      <div className='border border-b-2' />
      <ol className='mt-4'>
        <li>
          <p>{checkLinks(meaning?.shortdef?.[0])}</p>
        </li>
        {meaning?.shortdef?.[1] && (
          <li>
            <p>{checkLinks(meaning?.shortdef?.[1])}</p>
          </li>
        )}
      </ol>
      {synonyms && (
        <div className={`synonyms ${featureTheme} font-light`}>
          {checkSynonyms()}
        </div>
      )}
    </div>
  )
}

export default Meaning
