import React from "react"

import styled from "styled-components"

const StyledCard = styled.label`
  outline: 1px solid black;
  cursor: pointer;
  input {
    display: none;
  }
  opacity: ${(props) => (props.playable ? 1 : 0.5)};
  background-color: ${(props) => props.color};
  color: ${(props) => (props.color === "black" ? "white" : "black")};
`

const Card = (props) => {
  return (
    <StyledCard playable={props.value.isPlayable} color={props.value.color}>
      {props.children}
    </StyledCard>
  )
}

export default Card
