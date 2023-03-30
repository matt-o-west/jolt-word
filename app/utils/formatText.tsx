import { Link } from 'react-router-dom'

function formatText(text: string): JSX.Element {
  // Replace punctuation tokens with HTML tags and styles
  text = text.replace(
    /\{sc\}(.*?)\{\/sc\}/g,
    `<Link to=$1" className="text-lowercase">$1</Link>`
  )

  // Create a React element from the formatted text
  return <div dangerouslySetInnerHTML={{ __html: text }} />
}

export default formatText
