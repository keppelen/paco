import { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import Portal from '@reach/portal'

import Button from '@components/button'
import styles from '@styles/test.module.css'

const useDelayedMount = (active, options) => {
  const [mounted, setMounted] = useState(active)
  const [rendered, setRendered] = useState(active)
  const timer = useRef()
  const mountStart = useRef()

  const { enterDelay, exitDelay = enterDelay } = options

  useEffect(() => {
    clearTimeout(timer.current)

    if (active) {
      mountStart.current = Date.now()

      // Mount immediately
      setMounted(true)

      if (enterDelay === -1) {
        // Delay for a bit so that rendered is not immediately true
        requestIdleCallback(() => {
          // mountStart.current = Date.now()
          setRendered(true)
        })
      } else if (enterDelay === 0) {
        // Render immediately
        // mountStart.current = Date.now()
        setRendered(true)
      } else {
        // Render after a delay
        timer.current = setTimeout(() => {
          // mountStart.current = Date.now()
          setRendered(true)
        }, enterDelay)
      }
    } else {
      // Immediately set to unrendered
      setRendered(false)

      // This is an optimization so that we unmount as soon as possible
      // instead of always delaying for the time specified in exitDelay
      // i.e. if the `active` value becomes true and then false in quick succession
      let delayExitTime = exitDelay

      if (mountStart.current) {
        const timeSinceMount = Date.now() - mountStart.current

        if (timeSinceMount < enterDelay) {
          delayExitTime = 0
        } else if (timeSinceMount < exitDelay) {
          delayExitTime = timeSinceMount
        }
      }

      if (delayExitTime === 0) {
        // Unmount immediately – the content had not yet been rendered
        setMounted(false)
      } else {
        // Unmount after a delay
        timer.current = setTimeout(() => {
          setMounted(false)
        }, delayExitTime)
      }
    }
    // TODO: remove delays from dep array, this shouldn't re-run when they change
  }, [active, exitDelay, enterDelay])

  return {
    mounted,
    rendered
  }
}

const Popover = ({ active, enterDelay }) => {
  const { mounted, rendered } = useDelayedMount(active, {
    enterDelay, // This means do not render immediately, do it on the 2nd re-render
    exitDelay: 2000
  })

  return !mounted ? null : (
    <Portal>
      <div className={cn(styles.popover, { [styles.show]: rendered })}>
        popup contents
      </div>
    </Portal>
  )
}

const Test = () => {
  const [active, setActive] = useState(false)
  const [active2, setActive2] = useState(false)

  return (
    <div>
      <Button onClick={() => setActive(!active)}>Toggle Popover (Immediately shown)</Button>
      <Popover active={active} enterDelay={-1} />
      <span style={{ marginLeft: 50 }} />
      <Button onClick={() => setActive2(!active2)}>Toggle Popover (2000 delay on show)</Button>
      <Popover active={active2} enterDelay={2000} />
    </div>
  )
}

export default Test
