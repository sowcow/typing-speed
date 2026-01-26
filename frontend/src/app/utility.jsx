import React from 'react'
import { random } from 'lodash'
import { useEffect } from 'react'

export function ending (number, ending) {
  let hide = number === 1 ? 'hide' : 'show'
  return <span className={hide}>{ending}</span>
}

export function distance () {
  let angle = random(0, Math.PI * 2, true)
  let distance = random(300, 600)
  let dx = distance * Math.cos(angle)
  let dy = distance * Math.sin(angle)
  return { dx, dy }
}

export function useKeyboard (handleKeyboard) {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard)
    return () => {
      document.removeEventListener('keydown', handleKeyboard)
    }
  })
}
