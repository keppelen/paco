import { useState } from 'react'
import Page from '@components/page'
import css from '@lib/css'
import Button from '@components/button'

const Test = () => {
  const [count, setCount] = useState(20)

  return (
    <Page>
      <div
        className={css`
          font-size: ${count + 'px'};
          background: blue;
          appearance: none;
        `}
      >
        hihihi
      </div>
      <Button onClick={() => setCount(count + 10)}>Increase font size +10</Button>
      <Button onClick={() => setCount(count - 10)}>Decrease font size -10</Button>
      size: {count}
    </Page>
  )
}

export default Test
