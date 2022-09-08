import styled from "styled-components"

const Layout = styled.main`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 1rem;
  max-width: 720px;
  margin: 0 auto;
  outline: 1px solid red;
`

export default Layout
