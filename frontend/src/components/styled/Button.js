import styled from "styled-components"

const Button = styled.button`
  /* height: 2rem; */
  width: 100%;
  border: none;
  border-radius: 6px;
  text-align: center;
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#F35959")};
  color: ${(props) => (props.bgColor ? "#343434" : "white")};
  font-weight: bold;
  padding: 0.75rem 2rem;
  box-shadow: 2px 5px 11px rgba(0, 0, 0, 0.15);
  font-size: 1.1rem;
  cursor: pointer;
`
export default Button
