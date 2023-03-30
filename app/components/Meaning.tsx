import React from 'react'
import type { DefinitionType } from '~/routes/$word'
import type { Definition } from '~/routes/$word'
import replaceTokens from '~/utils/replaceTokens'
import { Link } from '@remix-run/react'
interface Props {
  meaning: Definition
}

type Synonym = string[][] | undefined

type SynonymType = Synonym | undefined

const Meaning = ({ meaning }: Props) => {
  const checkSynonyms = (meaning: Definition) => {
    const synonyms: SynonymType = meaning?.syns?.[0]?.pt

    if (!synonyms) {
      return null
    }
    console.log(synonyms)
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

  return (
    <div>
      <p>{meaning?.fl}</p>
      <ol>
        <li>
          <p>{meaning?.shortdef?.[0]}</p>
        </li>
        <li>
          <p>{meaning?.shortdef?.[1]}</p>
        </li>
      </ol>
      {checkSynonyms(meaning)}
    </div>
  )
}

export default Meaning
