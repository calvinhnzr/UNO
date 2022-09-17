import styled from "styled-components"

const Container = styled.section`
  width: 100%;
  display: ${(props) => (props.hidden ? "none" : "block")};
  grid-row: ${(props) => (props.row ? props.row : "1 / 13")};
  grid-column: ${(props) => (props.column ? props.column : "1 / 13")};
  align-self: center;
  /* place-self: center; */
`

export default Container
