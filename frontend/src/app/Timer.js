import { differenceInSeconds } from 'date-fns';
import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import useInterval from '@use-it/interval';

let CHECK_INTERVAL = 100

let Timer = ({ durationSec, onDone }, ref) => {
  let [started, setStarted] = useState(null)
  let [current, setCurrent] = useState(null)
  let [done, setDone] = useState(false)

  useInterval(() => {
    if (done) return
    if (!started) return

    let now = new Date()
    let difference = differenceInSeconds(now, started)
    if (difference !== current) setCurrent(difference)
    let timeLeft = durationSec - current
    if (timeLeft <= 0) {
      onDone()
      setDone(true)
    }
  }, CHECK_INTERVAL)

  useImperativeHandle(ref, () => ({
    start: () => {
      if (!started) setStarted(new Date())
    },
    // clear: () => to start after done have finished
  }))

  let timeLeft = durationSec - current

  return <div>
    { timeLeft } sec.
  </div>
}
Timer = forwardRef(Timer)

export default Timer
