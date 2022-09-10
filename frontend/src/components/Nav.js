import { Link } from "react-router-dom"

const Nav = () => {
  return (
    <>
      <Link to="/">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/game">Game</Link>
    </>
  )
}

export default Nav
