import stylis from './stylis.js'
import hash from 'fnv1a'

const pattern = /\s*([,])\s*/g
function getSelectorText(cssText) {
  const split = cssText.split('{')
  let selector = split[0].trim()
  let media = null
  if (selector.startsWith('@media')) {
    media = selector.substring(6).trim()
    selector = split[1].trim()
  }
  return selector !== ''
    ? { media, selector: selector.replace(pattern, '$1') }
    : null
}
const reverseCache = () => {
  const serverSheet = document.querySelector('#__css__')
  if (!serverSheet) return
  const rules = serverSheet.sheet.cssRules

  Array.prototype.forEach.call(rules, (rule, i) => {
    const cssText = rule.cssText
    const { selector } = getSelectorText(cssText)
    const value16 = selector.slice(3)
    const value10 = parseInt(value16, 16)
    console.log(value16, value10);
  })

}

const isServer = typeof window === 'undefined'
export const cache = isServer ? {} : reverseCache() || {}
export const flush = () =>
  Object.values(cache)
    .map(({ rules }) => rules)
    .join('')
let sheet = null

if (!isServer) {
  let element = document.querySelector('#__css__')

  if (!element) {
    element = document.createElement('style')
    element.id = '__css__'
    document.head.appendChild(element)
  }

  sheet = element.sheet
}

const process = rules => {
  if (!rules) return ''
  const h = hash(rules)
  const className = 'z-' + h.toString(16)

  cache[rules] = {
    className,
    rules: stylis()(`.${className}`, rules)
  }

  if (sheet) {
    sheet.insertRule(cache[rules].rules)
  }

  return className
}

export default rules => {
  const decls = rules.trim().split(';')

  let combinedClassname = []

  for (let dec of decls) {
    dec = dec.trim()

    if (cache[dec]) {
      combinedClassname += cache[dec].className
    } else {
      combinedClassname += process(dec)
    }

    combinedClassname += ' '
  }

  return combinedClassname.trim()
}
