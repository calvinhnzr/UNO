import React from "react"
import styled from "styled-components"
import Layout from "../components/styled/Layout"

const StyledRunningGame = styled.main`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, minmax(min-content, max-content));
  /* grid-template-rows: repeat(3, 1fr); */
  row-gap: 8rem;
  height: calc(100vh - 6rem);
  margin: 0 auto;
  padding: 3rem 0;
`

const RunningGame = (props) => {
  return <StyledRunningGame>{props.children}</StyledRunningGame>
}

export default RunningGame
