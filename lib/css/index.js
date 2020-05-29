import stylis from './stylis.js'
import hash from 'fnv1a'

export const cache = {}
let sheet = null
const isServer = typeof window === 'undefined'
export const flush = () => {
  return Object.values(cache)
    .map(({ rules }) => {
      console.log(rules)
      return rules
    })
    .join('')
}

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
  const className = 'csz-' + hash(rules).toString(36)

  cache[rules] = {
    hash: className,
    rules: stylis()(`.${className}`, rules)
  }

  if (sheet) {
    sheet.insertRule(cache[rules].rules)
  }

  return className
}

export default rules => {
  if (cache[rules]) {
    return cache[rules].hash
  }

  const className = process(rules)
  return className
}
