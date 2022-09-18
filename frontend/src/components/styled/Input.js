import styled from "styled-components"

const Input = styled.input`
  background: none;
  border: none;
  border-bottom: 2px solid white;
  padding: 0.5rem 0;
  color: white;
  font-size: 1.2rem;
  &::placeholder {
    color: white;
    font-size: 1.2rem;
    opacity: 0.5;
  }
`

export default Input
