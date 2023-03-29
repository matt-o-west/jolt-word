import React from 'react'
import type { DefinitionType } from '~/routes/$word'
import type { Definition } from '~/routes/$word'
import formatText from '~/utils/formatText'

const Meaning = ({ meaning }: Definition) => {
  /*const synonyms = meaning?.syns?.pt
    .map((synonym, i) => {
      if (synonym[0] === 'text') {
        return <span key={i}>{formatText(synonym[1])}</span>
      } else if (synonym[0] === 'vis') {
        return <span key={i}>{formatText(synonym[1][0].t)}, </span>
      }
      return null
    })
    .slice(0, 3)*/

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
      {/*synonyms && (
        <>
          <p>{meaning?.syns?.pl}:</p>
          <p>{synonyms}</p>
        </>
      )*/}
    </div>
  )
}

export default Meaning
