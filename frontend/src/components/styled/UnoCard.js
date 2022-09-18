import styled from "styled-components"

export const UnoCard = styled.label`
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#D9D9D9")};
  aspect-ratio: 2.25 / 3.5;
  width: 7rem;
  box-shadow: 1px 8px 12px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  opacity: ${(props) => (props.playable ? 1 : 0.4)};
  background-color: ${(props) => props.color};
  input {
    display: none;
  }
  position: relative;

  transform: ${(props) => (props.playable ? "translateY(-1rem)" : "")};

  h4 {
    font-size: 1rem;
    color: white;
    font-weight: bold;
  }

  &::after {
    content: ${(props) => (props.amount ? `"${props.amount}"` : "")};
    position: absolute;
    bottom: -2rem;
    font-weight: bold;
    color: white;
  }

  &.green {
    background-color: #71ce69;
  }
  &.red {
    background-color: #f35959;
  }
  &.blue {
    background-color: #5997f3;
  }
  &.yellow {
    background-color: #fff06d;
  }
  &.black {
    background-color: #343434;
  }
`

export const UnoCardBlock = styled.div`
  aspect-ratio: 2.25 / 3.5;
  width: 1.5rem;
  background-color: #3b4654;
  border-radius: 3px;
`

export default UnoCard
