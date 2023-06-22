import { useContext } from 'react'
import { Context } from '~/root'
import CrossOut1 from '~/components/icon/CrossOut1'
import CrossOut2 from '~/components/icon/CrossOut2'

const PlaceholderCard = ({ width = 'w-[335px]', index = 0 }) => {
  const { featureTheme } = useContext(Context)

  //console.log(`Passed down votes: ${votes}, word: ${word}`)

  return (
    <article
      className={`flex py-2 px-4 items-center rounded-sm text-2xl ${width} ${featureTheme} border-b-2 border-gray h-[62px]`}
    >
      {index % 2 === 0 ? <CrossOut1 /> : <CrossOut2 />}
    </article>
  )
}

export default PlaceholderCard
