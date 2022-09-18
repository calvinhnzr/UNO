import styled from "styled-components"

export const Container = styled.section`
  max-width: 20rem;
  width: 100%;
  display: ${(props) => (props.hidden ? "none" : "flex")};
  grid-row: ${(props) => (props.row ? props.row : "auto")};
  grid-column: ${(props) => (props.column ? props.column : "1 / 13")};
  flex-direction: ${(props) => (props.flexRow ? "row" : "column")};
  justify-self: center;
  gap: 1rem;
`

export const HandContainer = styled.aside`
  /* grid-column: 1 / 13; */
  position: absolute;
  bottom: 4rem;
  display: flex;
  left: 0;
  right: 0;
  flex-direction: ${(props) => (props.flexRow ? "row" : "column")};
`

export const DeckContainer = styled.section`
  /* grid-row: 3 / 6; */
  grid-column: 1 / 13;
  display: flex;
  gap: 2rem;
  justify-content: center;
  justify-self: center;
`

export const PlayerContainer = styled.section`
  grid-column: 1 / 13;
  display: flex;
  gap: 3rem;
  justify-content: center;
  justify-self: center;
  .singlePlayer {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    color: white;
    .singleBlocks {
      gap: 0.5rem;
      display: flex;
    }
  }
`
