import styled from "styled-components"

const Form = styled.form`
  grid-column: 5 / 8;
  /* display: flex;
  flex-direction: column; */
  label {
    max-width: 20rem;
    margin: 0 auto;
    input {
      background: none;
      border: none;
      border-bottom: 2px solid white;
      padding: 0.5rem 0;
      color: white;
      font-size: 1.2rem;
      &::placeholder {
        color: white;
        font-size: 1.2rem;
      }
    }
  }
`

export default Form
