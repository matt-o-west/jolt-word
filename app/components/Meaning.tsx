import type { Definition } from '~/routes/$word'
import replaceTokens from '~/utils/replaceTokens'
import { Link } from '@remix-run/react'
import { useContext, Fragment } from 'react'
import { Context } from '~/root'
import _ from 'lodash'

interface Props {
  meaning: Definition
  previousMeaning?: Definition | undefined
}

type Synonym = string[][] | undefined

type SynonymType = Synonym | undefined

const Meaning = ({ meaning, previousMeaning }: Props) => {
  const { featureTheme, font } = useContext(Context)

  const synonyms: SynonymType = meaning?.syns?.[0]?.pt

  // check if there are synonyms and format their tokens if so
  const checkSynonyms = () => {
    if (!synonyms) {
      return null
    }

    if (synonyms) {
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

  let exampleSentenceOne = _.get(
    meaning,
    'def[0].sseq[0][0][1].dt[1][1][0].t',
    ''
  )

  let exampleSentenceTwo = _.get(
    meaning,
    'def[0].sseq[0][1][1].dt[1][1][0].t',
    ''
  )

  /*let exampleSentences = []
  _.forEach(meaning.def, (defItem) => {
    _.forEach(defItem.sseq, (sseqItem) => {
      _.forEach(sseqItem, (senseItem) => {
        if (senseItem[0] === 'sense') {
          _.forEach(senseItem[1].dt, (dtItem) => {
            if (dtItem[0] === 'vis' && Array.isArray(exampleSentences)) {
              exampleSentences.push(dtItem[1][0].t)
            }
          })
        }
      })
    })
  })*/

  return (
    <>
      {meaning.fl && (
        <div className='mt-10'>
          <span className={`italic font-sans-serif text-xl`}>
            {meaning?.fl}
          </span>
          <div className='border border-b-2' />
          <ol className='mt-4 ml-8 text-lg'>
            <li>
              <p>{checkLinks(meaning?.shortdef?.[0])}</p>
            </li>

            {meaning?.shortdef?.[1] && (
              <li>
                <p>{checkLinks(meaning?.shortdef?.[1])}</p>
              </li>
            )}
          </ol>
          <div className='mt-4 flex justify-end'>
            {exampleSentenceOne && (
              <div className='inline-flex flex-row rounded-md px-3 py-1 items-center bg-purple.200 text-xl tex'>
                <p>{replaceTokens(exampleSentenceOne)}</p>
              </div>
            )}
          </div>
          <div className='mt-2 mb-4 flex justify-end'>
            {exampleSentenceTwo && (
              <div className='inline-flex flex-row rounded-md px-3 py-1 items-center bg-purple.200 text-xl tex'>
                <p>{replaceTokens(exampleSentenceTwo)}</p>
              </div>
            )}
          </div>
          {synonyms && (
            <div className={`synonyms ${featureTheme} font-light`}>
              {checkSynonyms()}
            </div>
          )}
        </div>
      )}
      {meaning.cxs && !previousMeaning?.fl && (
        <div className='mt-10'>
          <span className='italic text-xl font-light '>
            {meaning.cxs[0].cxl}{' '}
          </span>
          <span className='text-xl font-base '>
            {meaning.cxs[0].cxtis.map((cxti, index, array) => (
              <Fragment key={cxti.cxt}>
                <Link to={`/${cxti.cxt}`} className='link'>
                  {cxti.cxt}
                </Link>
                {index < array.length - 1 ? ', ' : ''}
              </Fragment>
            ))}
          </span>
        </div>
      )}
    </>
  )
}

export default Meaning
