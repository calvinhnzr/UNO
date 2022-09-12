import { useState, useEffect, useContext } from "react"
import { useNavigate, Outlet } from "react-router-dom"

import { Context } from "../context/Context"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"
import Title from "../components/styled/Title"
import { saveToStorage } from "../helpers/saveToStorage"
import { fetchToken } from "../helpers/fetchToken"

const URL = "http://localhost:8000/api/game"

const Dashbaord = () => {
  const navigate = useNavigate()
  const { user, setUser, game, setGame } = useContext(Context)
  const [gameId, setGameId] = useState("")

  async function handleJoinGame(token) {
    const response = await fetch(`${URL}/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`, // notice the Bearer before your token
      },
    })

    // game.id, game.started ? return false : response

    const data = await response.json()
    if (!data.error) {
      game.joinedRoom = true
      game.id = data.id
      setGame({ ...game })
      navigate(game.id ? `/game/${game.id}` : "/")
    } else {
      console.log(data)
    }

    // saveToStorage("gameId", data.id)
    // user.gameId = data.id
    // setUser({ ...user })
    // console.log(user)
    // navigate(user.gameId ? `/game/${user.gameId}` : "/")
  }

  async function handleNewGame(token) {
    // console.log("new game")
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`, // notice the Bearer before your token
      },
    })
    const data = await response.json()
    game.joinedRoom = true
    game.id = data.id
    setGame({ ...game })
    navigate(game.id ? `/game/${game.id}` : "/")

    // Old:
    // saveToStorage("gameId", data.id)
    // user.gameId = data.id
    // setUser({ ...user })
    // console.log(user)
    // navigate(user.gameId ? `/game/${user.gameId}` : "/")
  }

  return (
    <Layout>
      <Container>
        <Title>User: {user.name}</Title>
        <p>User ID: {user.id}</p>
        <p>Game ID: {user.gameId}</p>
        <button onClick={() => console.log(user)}>Get State</button>
        <button onClick={() => (localStorage.clear(), navigate("/", { replace: true }))}>Clear localStorage</button>
        <button onClick={() => handleNewGame(user.token)}>new Game</button>
        <label>
          Join Game
          <input type="text" value={gameId} onChange={(e) => setGameId(e.target.value)} />
          <button onClick={() => handleJoinGame(user.token)}>Join Game</button>
        </label>
      </Container>
    </Layout>
  )
}

export default Dashbaord
