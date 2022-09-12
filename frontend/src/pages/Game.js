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

const socket = io.connect(`http://localhost:8000`)
const ruleSocket = io.connect(`http://localhost:8002`)

const Game = () => {
  const navigate = useNavigate()
  const { user, setUser, game, setGame } = useContext(Context)
  const [deckSize, setDeckSize] = useState(0)

  function handleLeaveGame() {
    console.log("leave_game")
    socket.emit("leave_game", game.id)
    setGame({
      id: "",
      joined: false,
      started: false,
      players: [],
      hand: [],
      discardPile: { card: {}, size: 0 },
    })
    navigate("/")
  }

  function handleStartGame() {
    console.log("start_game")
    socket.emit("start_game", game.id)
  }

  function handleDrawCard() {
    console.log("draw_card")
    socket.emit("draw_card", game.id)
  }

  function handlePlayCard(card) {
    console.log("play_card")
    socket.emit("play_card", card, game.id)
  }

  useEffect(() => {
    socket.io.opts.query = `token=${localStorage.getItem("token")}`
    socket.connect()
    ruleSocket.io.opts.query = `token=${localStorage.getItem("token")}`
    ruleSocket.connect()

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

    socket.on("deck_size_updated", (size) => {
      console.log("deck_size_updated")
      setDeckSize(size)
    })

    socket.on("discard_pile_updated", (newDiscardPile) => {
      console.log("discard_pile_updated", newDiscardPile)
      game.discardPile = newDiscardPile

      setGame({ ...game })
      console.log("discard_pile_updated", game.discardPile)
      ruleSocket.emit("check_hand", { hand: game.hand, discardPileCard: game.discardPile })
    })

    socket.on("disconnect_from_socket", (players) => {
      console.log("disconnect_from_socket")
      game.players = players
      setGame({ ...game })
    })

    socket.on("played_card", (data) => {
      console.log("played_card", data.playerId)
      game.players = data.players
      setGame({ ...game })
    })

    socket.on("get_hands", (data) => {
      game.hand = data.hand
      game.players = data.players
      setGame({ ...game })
      console.log("discard_pile", game.discardPile)

      ruleSocket.emit("check_hand", { hand: game.hand, discardPileCard: game.discardPile })
    })

    ruleSocket.on("checked_hand", (hand) => {
      // update hand cards state if card is playable
      console.log("checked_hand", hand)

      game.hand = hand
      setGame({ ...game })
    })

    socket.on("game_started", (data) => {
      console.log("game_started", data)
      game.started = data.started
      setGame({ ...game })

      // socket.on("give_start_hand", (data) => {
      //   game.hand = data.playerHand
      //   game.players = data.players
      //   setGame({ ...game })
      // })
    })

    socket.on("game_ended", (data) => {
      game.started = data.started
      game.winner = data.winner
      setGame({ ...game })

      alert("Winner is " + game.winner)
    })

    socket.on("disconnect", () => {
      console.log("disconnect")
      handleLeaveGame()
    })

    return () => {
      console.log("unmounted")
      socket.off("player_joined")
      socket.off("player_left")
      socket.off("deck_size_updated")
      socket.off("discard_pile_updated")
      socket.off("disconnect_from_socket")
      socket.off("played_card")
      socket.off("get_hands")
      socket.off("checked_hand")
      socket.off("game_started")
      socket.off("disconnect")
      handleLeaveGame()
    }
  }, [socket, ruleSocket])

  return (
    <>
      {game.started ? (
        <RunningGame>
          <Container>
            <h1>Running Game</h1>
            <button onClick={() => console.log("Deck: ", deckSize)}>Get Deck</button>
            <button onClick={() => console.log("Hand: ", game.hand)}>Get Hand</button>
            <button onClick={() => console.log("Discard Pile: ", game.discardPile)}>Get Discard Pile:</button>
            <button onClick={() => console.log("State: ", game)}>Get State</button>
            <button onClick={() => handleLeaveGame()}>Leave Game</button>
            <button onClick={() => handleDrawCard()}>Draw Card</button>
          </Container>
          <Container>
            <h2>Deck Size</h2>
            <h4>{deckSize}</h4>
          </Container>
          <Container>
            <h2>Discard Pile</h2>
            <h4>{game.discardPile.size}</h4>
            <h4>Color: {game.discardPile.card.color}</h4>
            <h4>Number: {game.discardPile.card.number}</h4>
            <h4>Method: {game.discardPile.card.method}</h4>
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
                  <Card key={index} value={value}>
                    <h4>Color: {value.color}</h4>
                    <h4>Number: {value.number}</h4>
                    <h4>Method: {value.method}</h4>
                    <input type="button" onClick={() => (value.isPlayable ? handlePlayCard(value) : null)} />
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
