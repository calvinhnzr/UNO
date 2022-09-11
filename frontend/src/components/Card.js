import React from "react"

import styled from "styled-components"

const StyledCard = styled.label`
  outline: 1px solid black;
  cursor: pointer;
  input {
    display: none;
  }
`

const Card = (props) => {
  return <StyledCard>{props.children}</StyledCard>
}

export default Card
