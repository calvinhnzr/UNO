import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Context } from "../context/Context"
import io from "socket.io-client"

import Card from "../components/Card"
import Hand from "../components/styled/Hand"
import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"
import RunningGame from "./RunningGame"
import GameLobby from "./GameLobby"

// const socket = io.connect(`http://localhost:8000`, { query: `token=OlUJn` })
const socket = io.connect(`http://localhost:8000`)
// let socket

const Game = () => {
  const navigate = useNavigate()
  const { user, setUser, game, setGame } = useContext(Context)
  const [deckSize, setDeckSize] = useState(0)
  const [discardPile, setDiscardPile] = useState([])
  const [hand, setHand] = useState([])

  function handleLeaveGame() {
    console.log("leave_game")
    socket.emit("leave_game", game.id)
    setGame({ id: "", joined: false, started: false, players: [""] })
    navigate("/")
  }

  function handleStartGame() {
    console.log("start_game")
    socket.emit("start_game", game.id)
  }

  function handleDrawCard(amount) {
    // draw ${amount} card from DRAW PILE
    socket.emit("draw_card", amount)
    console.log("draw card")
  }

  function handlePlayCard(card) {
    // place one card to the DISCARD PILE
    console.log("play_card")

    socket.emit("play_card", card, game.id)
    // id, name, currentHand
  }

  function handleCheckHand() {
    //
  }

  useEffect(() => {
    socket.io.opts.query = `token=${localStorage.getItem("token")}`
    socket.connect()

    socket.emit("join_game", game.id)

    socket.on("player_joined", (players) => {
      console.log("player_joined")
      console.log(players)
      game.players = players
      setGame({ ...game })
    })

    socket.on("player_left", (players) => {
      console.log("player_left")
      console.log(players)
      game.players = players
      setGame({ ...game })
    })

    socket.on("receive_player_state")

    socket.on("disconnect_from_socket", (players) => {
      console.log("disconnect_from_socket")
      game.players = players
      setGame({ ...game })
    })

    socket.on("played_card", (card) => {
      //
      console.log("played_card")
    })

    // socket.on("new_deck_size")

    socket.on("game_started", (data) => {
      console.log("game_started", data)
      game.started = data.started
      setGame({ ...game })
      setDeckSize(data.deckSize)
      setDiscardPile(data.discardPile)

      socket.on("give_start_hand", (data) => {
        // get 7 cards
        // hand = data

        game.hand = data.playerHand
        game.players = data.players
        setGame({ ...game })
      })
    })

    socket.on("disconnect", () => {
      console.log("disconnect")
      handleLeaveGame()
    })

    return () => {
      console.log("unmounted")
      socket.off("player_joined")
      socket.off("player_left")
      socket.off("game_started")
      handleLeaveGame()
    }
  }, [socket])

  return (
    <>
      {game.started ? (
        <RunningGame>
          <Container>
            <h1>Running Game</h1>
            <button onClick={() => console.log("Deck: ", deckSize)}>Get Deck</button>
            <button onClick={() => console.log("Hand: ", game.hand)}>Get Hand</button>
            <button onClick={() => console.log("Discard Pile: ", discardPile)}>Get Discard Pile:</button>
            <button onClick={() => console.log("State: ", game)}>Get State</button>
          </Container>
          <Container>
            <h2>Players:</h2>
            {game.players.map((value, index) => (
              <div key={index}>
                <h5>{value.name}</h5>
                <p>{value.handSize}</p>
              </div>
            ))}
          </Container>
          <Container>
            <Hand>
              {game.hand.map((value, index) => {
                return (
                  <Card key={index}>
                    <h4>Color: {value.color}</h4>
                    <h4>Number: {value.number}</h4>
                    <h4>Method: {value.method}</h4>
                    <input type="button" onClick={() => handlePlayCard(value)} />
                  </Card>
                )
              })}
            </Hand>
          </Container>
        </RunningGame>
      ) : (
        <GameLobby>
          <Container>
            <h1>My Game: {game.id}</h1>
            <h2>Me: {user.name}</h2>
          </Container>
          <Container>
            <button onClick={handleStartGame}>Start Game</button>
            <button onClick={handleLeaveGame}>Leave Game</button>
          </Container>
          <Container>
            <h2>Players:</h2>
            {game.players.map((value, index) => (
              <p key={index}>{value.name}</p>
            ))}
          </Container>
        </GameLobby>
      )}
    </>
  )
}

export default Game
