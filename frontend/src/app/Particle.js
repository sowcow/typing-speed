import React from 'react'
import styled from 'styled-components'

let SelfCenter = styled.div`
  transform: translate(-50%, -50%);
`
let ParticleTemplate = styled.div`
  * {
    ${({ focus }) => (focus ? '' : 'color: #ddd !important;')}
  }
  ${({ focus }) => (focus ? '' : 'font-size: 32px;')}
  position: absolute;
  white-space: nowrap;
`

function Particle ({ dx, dy, children, focus }) {
  let style = {
    transform: `translate(${dx}px, ${dy}px)`
  }
  return (
    <ParticleTemplate style={style} focus={focus}>
      <SelfCenter>{children}</SelfCenter>
    </ParticleTemplate>
  )
}

export default Particle
