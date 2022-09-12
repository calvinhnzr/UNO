import React from "react"

import styled from "styled-components"

const StyledCard = styled.label`
  outline: 1px solid black;
  cursor: pointer;
  input {
    display: none;
  }
  background-color: ${(props) => props.color};
  color: ${(props) => (props.color === "black" ? "white" : "black")};
`

const Card = (props) => {
  return <StyledCard color={props.value.color}>{props.children}</StyledCard>

}

export default Card
