import styled from "styled-components"

const Layout = styled.main`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(5, minmax(min-content, max-content)) auto;
  padding-top: 8rem;
  gap: 2rem;
  height: calc(100vh - 8rem);
  margin: 0 auto;
`

export default Layout
