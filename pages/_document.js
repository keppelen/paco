import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

import { themeStorageKey } from '@lib/theme'
const bgVariableName = '--bg'

import { flush, cache } from '@lib/css'

class MyDocument extends Document {
  render() {
    const x = flush()
    console.log('server-side computed rules', x)
    return (
      <Html lang="en">
        <Head>
          <style id="__css__">{x}</style>
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `(() => window.__cssCache__ = ${JSON.stringify(cache)})()`
            }}
          /> */}
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
                try {
                  var outdatedValue = localStorage.getItem('paco-light-mode')

                  if (outdatedValue) {
                    localStorage.setItem('${themeStorageKey}', 'light')
                    localStorage.removeItem('paco-light-mode')
                  }

                  var mode = localStorage.getItem('${themeStorageKey}')
                  if (!mode) return
                  document.documentElement.classList.add(mode)
                  var bgValue = getComputedStyle(document.documentElement)
                    .getPropertyValue('${bgVariableName}')
                  document.documentElement.style.background = bgValue
                } catch (e) {}
              })()`
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
