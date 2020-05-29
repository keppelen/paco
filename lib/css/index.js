import stylis from './stylis.js'
import hash from 'fnv1a'

const cache = {}
let sheet = null
const isServer = typeof window === 'undefined'

if (!isServer) {
  const style = document.createElement('style')
  document.head.appendChild(style)
  sheet = style.sheet
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

export default (strings, ...values) => {
  const rules = strings.reduce((acc, string, i) => {
    return (acc += string + (values[i] == null ? '' : values[i]))
  }, '')

  if (cache[rules]) {
    return cache[rules].hash
  }

  const className = process(rules)
  return className
}
