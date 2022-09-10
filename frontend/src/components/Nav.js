import { Link } from "react-router-dom"

const Nav = (props) => {
  return (
    <>
      <Link to="/">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to={`/game/${props.gameId}`}>Game</Link>
    </>
  )
}

export default Nav
