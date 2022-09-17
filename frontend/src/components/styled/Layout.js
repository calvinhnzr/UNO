import styled from "styled-components"

const Layout = styled.main`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(7, 1fr);
  gap: 2rem;
  height: calc(100vh);
  margin: 0 auto;
  outline: 1px solid green;
`

export default Layout
