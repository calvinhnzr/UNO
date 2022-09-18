import { useState, useEffect, useContext } from "react"
import { useNavigate, Outlet } from "react-router-dom"

import { Context } from "../context/Context"

import Layout from "../components/styled/Layout"
import { Container } from "../components/styled/Container"
import Title from "../components/styled/Title"
import { saveToStorage } from "../helpers/saveToStorage"
import { fetchToken } from "../helpers/fetchToken"
import PreTitle from "../components/styled/PreTitle"
import Form from "../components/styled/Form"
import Button from "../components/styled/Button"
import Input from "../components/styled/Input"

const URL = "http://localhost:8000/api/game"

const Dashbaord = () => {
  const navigate = useNavigate()
  const { user, setUser, game, setGame } = useContext(Context)
  const [gameId, setGameId] = useState("")

  async function handleJoinGame(e) {
    e.preventDefault()
    const response = await fetch(`${URL}/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`, // notice the Bearer before your token
      },
    })

    const data = await response.json()
    if (!data.error) {
      game.joinedRoom = true
      game.id = data.id
      setGame({ ...game })
      navigate(game.id ? `/game/${game.id}` : "/")
    } else {
      console.log(data)
    }
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
  }

  return (
    <Layout>
      <Container>
        <PreTitle>{user.name}</PreTitle>
        <Title>Uno</Title>
      </Container>
      <Container>
        <Form onSubmit={handleJoinGame}>
          <Input
            required
            type="text"
            placeholder="Game Id"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <Button bgColor="#D9D9D9" type="submit">
            Join Game
          </Button>
        </Form>
        <Button onClick={() => handleNewGame(user.token)}>New Game</Button>
      </Container>
      <Container hidden>
        <button onClick={() => (localStorage.clear(), navigate("/", { replace: true }))}>Clear localStorage</button>
      </Container>
    </Layout>
  )
}

export default Dashbaord
