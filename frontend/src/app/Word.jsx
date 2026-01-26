import React from 'react'
import styled from 'styled-components'
import { times } from 'lodash'

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
let Cursor = () => (
  <CursorStyle>
    <CursorInner />
  </CursorStyle>
)

function Word ({ input, word, focus, hideCursor, finish }) {
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

  return (
    <>
      <Right>{right}</Right>
      <Err>{err}</Err>
      {focus && !hideCursor ? <Cursor /> : null}
      {finish ? <ErrRest>{rest}</ErrRest> : <Rest>{rest}</Rest>}
    </>
  )
}

export default Word
