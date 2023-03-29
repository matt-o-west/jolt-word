function formatText(text: string): string {
  // Replace punctuation tokens with HTML tags and styles
  text = text.replace(/\{b\}(.*?)\{\\\/b\}/g, '<strong>$1</strong>')
  text = text.replace(/\{bc\}/g, '<span style="font-weight: bold;">:</span>')
  text = text.replace(/\{inf\}(.*?)\{\\\/inf\}/g, '<sub>$1</sub>')
  text = text.replace(/\{it\}(.*?)\{\\\/it\}/g, '<em>$1</em>')
  text = text.replace(/\{ldquo\}/g, '&#8220;')
  text = text.replace(/\{rdquo\}/g, '&#8221;')
  text = text.replace(
    /\{sc\}(.*?)\{\\\/sc\}/g,
    '<span style="font-variant: small-caps;">$1</span>'
  )
  text = text.replace(/\{sup\}(.*?)\{\\\/sup\}/g, '<sup>$1</sup>')
  text = text.replace(/\{p_br\}/g, '<br>')

  return text
}

export default formatText
