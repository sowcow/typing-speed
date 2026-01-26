import React from 'react'

import Typing from './Typing'
import Hotkey from './Hotkey'
import words from './words.json'
import { shuffle } from 'lodash'

function App () {
  let xs = shuffle(words)
  return <>
    <Hotkey />
    <Typing words={xs} />
  </>
}

export default App
