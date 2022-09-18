import styled from "styled-components"

export const Block = styled.div`
  background-color: ${(props) => (props.player ? "#5997F3" : "#3B4654")};
  padding: 1rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  color: white;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  &:hover {
    svg {
      opacity: 1;
    }
  }
  svg {
    transition: 0.2s ease-in-out;
    padding: 0 0.5rem 0rem 1rem;
    transform-origin: center;
    transform: scale(1.4);
    opacity: 0;
  }
`
export const BlockContainer = styled.aside`
  display: flex;
  gap: 1rem;
`
