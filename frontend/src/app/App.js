import React from 'react';

import Typing from './Typing';
import words from './words.json';
import { shuffle } from 'lodash'

function App() {
  let xs = shuffle(words)
  return (
    <Typing words={xs} />
  )
}

export default App;
