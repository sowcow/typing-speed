import { animated, useSpring } from 'react-spring'
import React, { useState, useRef } from 'react'

import { distance, ending, useKeyboard } from './utility'
import Layout from './Layout'
import Particle from './Particle'
import Timer from './Timer'
import Word from './Word'

let DURATION = 60

let INFO = [
  'Type space after every word;',
  'The timer starts after any input;',
  'If you need to restart — reload the page;'
]

let A_LETTER = /^.$/
function Typing ({ words }) {
  let [started, setStarted] = useState(false)
  let [done, setDone] = useState(false)
  let [good, setGood] = useState(0)
  let [bad, setBad] = useState(0)

  let [input, setInput] = useState('')
  let [particles, setParticles] = useState([])
  let [wordIndex, setWordIndex] = useState(0)
  let word = words[wordIndex]

  let nextWord = () => {
    let success = input === word

    if (success) {
      setGood(good + 1)
    } else {
      setBad(bad + 1)
    }

    let { dx, dy } = distance()
    let particle = { input, word, dx, dy }

    setParticles(particles.concat(particle))
    setWordIndex(wordIndex + 1)
    setInput('')
  }

  let startGame = () => {
    timerRef.current.start()
    setStarted(true)
  }

  function handleKeyboard (e) {
    if (done) return

    if (e.key === ' ') {
      // || e.key === 'Enter') {
      if (input === '') return // NOTE: double presses are ok.....
      nextWord()
    } else if (e.key === 'Backspace') {
      setInput(input.substring(0, input.length - 1))
    } else if (A_LETTER.test(e.key)) {
      startGame()
      input += e.key
      setInput(input)
    }
  }

  useKeyboard(handleKeyboard)

  let timerRef = useRef()

  let onTimer = () => {
    setDone(true)
  }

  let targetColor = done ? '#06c' : 'gray'
  let props = useSpring({
    color: targetColor,
    padding: done ? 30 : 0,
    from: {
      color: 'gray',
      padding: 0
    }
  })
  let hideOnDone = useSpring({ opacity: done ? 0 : 1, from: { opacity: 1 } })

  let rotateOnDone = useSpring({
    config: {
      friction: 1,
      clamp: 1
    },
    from: {
      opacity: 1,
      transform: 'rotate(0deg) scale(1)'
    },
    to: !done
      ? []
      : [
          {
            opacity: 1,
            transform: 'rotate(360deg) scale(1.1)'
          },
          {
            opacity: 0,
            transform: 'rotate(0deg) scale(0)'
          }
        ]
  })

  return (
    <Layout
      info={started ? null : INFO}
      center={
        <>
          {particles.map((x, i) => (
            <Particle dx={x.dx} dy={x.dy} key={i}>
              <Word input={x.input} word={x.word} finish={true} />
            </Particle>
          ))}
          <Particle dx={0} dy={0} focus={true}>
            <animated.div style={rotateOnDone}>
              <Word input={input} word={word} focus={true} hideCursor={done} />
            </animated.div>
          </Particle>
        </>
      }
      stats={
        <animated.div style={props}>
          <animated.div style={hideOnDone}>
            <Timer ref={timerRef} durationSec={DURATION} onDone={onTimer} />
          </animated.div>
          <div>
            {good} hit{ending(good, 's')}
          </div>
          <div>
            {bad} miss{ending(bad, 'es')}
          </div>
        </animated.div>
      }
    />
  )
}

export default Typing
