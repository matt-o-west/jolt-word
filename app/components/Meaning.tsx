import React from 'react'
import type { DefinitionType } from '~/routes/$word'
import type { Definition } from '~/routes/$word'
import formatText from '~/utils/formatText'
import { Link } from '@remix-run/react'
interface Props {
  meaning: Definition
}

type Synonym = string[][] | undefined

type SynonymType = Synonym | undefined

const Meaning = ({ meaning }: Props) => {
  const checkSynonyms = (meaning: Definition) => {
    const synonyms: SynonymType = meaning?.syns[0]?.pt
    console.log(synonyms)
    if (synonyms) {
      console.log(synonyms)
      return synonyms
        .slice(0, 4)
        .filter((arr) => arr[0] === 'text')
        .map((synonym, i) => {
          console.log(formatText(synonym[1]))
          return (
            <div key={i} className='text-lowercase'>
              {formatText(synonym[1])}
            </div>
          )
        })
    }
    return null
  }

  console.log(meaning)

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
