import { animated, useSpring } from 'react-spring';
import { times, random } from 'lodash'
import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components'

import Timer from './Timer';

let DURATION = 60

let Global = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  html, body, #root, #root > div {
    height: 100%;
  }
`

let A_LETTER = /^.$/
let Root = styled.div`
  font-size: 48pt;
  display: flex;
  overflow: hidden;
`
let Center = styled.div`
  margin: auto;
  position: relative;
`
let Right = styled.div`
  color: #06c;
  display: inline;
`
let Err = styled.div`
  display: inline;
  color: #f30;
  text-decoration: line-through;
`
let Rest = styled.div`
  display: inline;
  color: #b3b3cc;
`
let ErrRest = styled.div`
  display: inline;
  color: #b3b3cc;
  text-decoration: line-through;
`
let CursorStyle = styled.div`
  display: inline;
  position: relative;
`
let CursorInner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  transform: translateX(-0px);
  border-right: solid 1px #345;
  height: 100%;
`
let Cursor = () =>
  <CursorStyle>
    <CursorInner />
  </CursorStyle>
let TimerBox = styled.div`
  position: fixed;
  z-index: 100;
  right: 0;
  bottom: 0;
  color: gray;
  font-size: 32px;
`
let InfoBox = styled.div`
  position: fixed;
  z-index: 100;
  left: 0;
  bottom: 0;
  color: gray;
  font-size: 32px;
`

function Typing({ words }) {
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

    let newParticles = []
    // times(10, () => {
      let { dx, dy } = distance()
      let particle = { input, word, dx, dy }
      newParticles.push(particle)
    // })
    setParticles(particles.concat(newParticles))
    setWordIndex(wordIndex + 1)
    setInput('')
  }

  let startGame = () => {
    timerRef.current.start()
    setStarted(true)
  }

  function handleKeyboard(e) {
    if (done) return

    if (e.key === ' ') { // || e.key === 'Enter') {
      if (input == '') return // NOTE: double presses are ok.....
      nextWord()
    } else
    if (e.key === 'Backspace') {
      setInput(input.substring(0, input.length - 1))
    } else
    if (A_LETTER.test(e.key)) {
      startGame()
      input += e.key
      setInput(input)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard)
    return () => {
      document.removeEventListener('keydown', handleKeyboard)
    }
  })

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
      padding: 0,
    }
   })
  let hideOnDone = useSpring({ opacity: done ? 0 : 1, from: { opacity: 1 } })

  let rotateOnDone = useSpring({
    config: {
      friction: 1,
      clamp: 1,
    },
    from: {
      opacity: 1,
      transform: 'rotate(0deg) scale(1)',
		},
    to: !done ? [] : [
			{
				opacity: 1,
				transform: 'rotate(360deg) scale(1.1)',
			},
			{
				opacity: 0,
				transform: 'rotate(0deg) scale(0)',
			},
		],
	})

  return <Root>
    <Global />
    <Center>
      {
        particles.map( (x, i) =>
          <Particle dx={x.dx} dy={x.dy} key={i}>
            <Word input={x.input} word={x.word} finish={true} />
          </Particle>
        )
      }
      <Particle dx={0} dy={0} focus={true}>
				<animated.div style={rotateOnDone}>
					<Word input={input} word={word} focus={true} hideCursor={done} />
				</animated.div>
      </Particle>
    </Center>
    { started ? null :
    <InfoBox>
      <ul>
        <li>
          Type space after every word;
        </li>
        <li>
          The timer starts after any input;
        </li>
        <li>
          If you need to restart — reload the page;
        </li>
      </ul>
    </InfoBox>
    }
		<TimerBox>
			<animated.div style={props}>
        <animated.div style={hideOnDone}>
					<Timer ref={timerRef}
						durationSec={DURATION}
						onDone={onTimer}
					/>
        </animated.div>
        <div>
          { good } hits
        </div>
        <div>
          { bad } { bad == 1 ? 'miss' : 'misses' }
        </div>
			</animated.div>
		</TimerBox>
  </Root>
}

function distance() {
  let angle = random(0, Math.PI * 2, true)
  let distance = random(300, 600)
  let dx = distance * Math.cos(angle)
  let dy = distance * Math.sin(angle)
  return { dx, dy }
}

let SelfCenter = styled.div`
  transform: translate(-50%, -50%);
`
let ParticleTemplate = styled.div`
  * {
    ${({focus}) => focus ? '' : 'color: #ddd !important;'}
  }
  ${({focus}) => focus ? '' : 'font-size: 32px;'}
  position: absolute;
`
function Particle({ dx, dy, children, focus }) {
  let style = {
    transform: `translate(${dx}px, ${dy}px)`
  }
  return <ParticleTemplate style={style} focus={focus}>
    <SelfCenter>
      { children }
    </SelfCenter>
  </ParticleTemplate>
}

function Word({ input, word, focus, hideCursor, finish }) {
  let right = ''
  let err = ''
  let rest = ''

  let mistaken = false
  times(Math.max(word.length, input.length), i => {
    if (i < input.length) {
      if (!mistaken) {
        mistaken = i >= word.length || input[i] !== word[i]
      }
      if (mistaken) {
        err += input[i]
      } else {
        right += input[i]
      }
    } else {
      rest += word[i]
    }
  })

  return <>
    <Right>{ right }</Right>
    <Err>{ err }</Err>
    { focus && !hideCursor ? <Cursor /> : null }
    { finish ?
			<ErrRest>{ rest }</ErrRest> :
			<Rest>{ rest }</Rest>
		}
  </>
}

export default Typing
