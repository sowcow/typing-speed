import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

let Global = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  html, body, #root, #root > div {
    height: 100%;
  }
  .show, .hide {
    transition: opacity 0.3s;
  }
  .show {
    opacity: 1;
  }
  .hide {
    opacity: 0;
  }
`

let Root = styled.div`
  font-size: 48pt;
  display: flex;
  overflow: hidden;
`

let InfoBox = styled.div`
  position: fixed;
  z-index: 100;
  left: 0;
  bottom: 0;
  color: gray;
  font-size: 32px;
`

let StatsBox = styled.div`
  position: fixed;
  z-index: 100;
  right: 0;
  bottom: 0;
  color: gray;
  font-size: 32px;
`

let Center = styled.div`
  margin: auto;
  position: relative;
`

// info - either null or string[]
// center - element
// stats - element
function Layout ({ info, center, stats }) {
  return (
    <Root>
      <Global />
      <Center>{center}</Center>
      {!info ? null : (
        <InfoBox>
          <ul>
            {info.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </InfoBox>
      )}
      <StatsBox>{stats}</StatsBox>
    </Root>
  )
}

export default Layout
