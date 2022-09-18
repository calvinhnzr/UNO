import { useState, useEffect, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../context/Context"
import io from "socket.io-client"
import { BiCopy } from "react-icons/bi"

import Card from "../components/Card"
import Hand from "../components/styled/Hand"
import { Container, HandContainer, DeckContainer, PlayerContainer } from "../components/styled/Container"
import RunningGame from "./RunningGame"
import GameLobby from "./GameLobby"
import Title from "../components/styled/Title"
import PreTitle from "../components/styled/PreTitle"
import Button from "../components/styled/Button"
import { Block, BlockContainer } from "../components/styled/Block"
import { UnoCard, UnoCardBlock } from "../components/styled/UnoCard"

const socket = io.connect(`http://localhost:8000`)
const ruleSocket = io.connect(`http://localhost:8002`)

const Game = () => {
  const iconRef = useRef(null)

  const navigate = useNavigate()
  const { user, setUser, game, setGame } = useContext(Context)
  const [deckSize, setDeckSize] = useState(0)

  function handleCopyClipboard() {
    navigator.clipboard.writeText(game.id)
    const svg = iconRef.current.children[0]
    svg.style.color = "#71CE69"
    setTimeout(function () {
      svg.style.color = "rgba(255, 255, 255, 0.2)"
    }, 300)
  }

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
    // game can only be started when at least two playes are in lobby
    if (game.players.length > 1) {
      console.log("start_game")
      socket.emit("start_game", game.id)
    }
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

    // update hands
    socket.on("get_hands", (data) => {
      if (data.hand) {
        game.hand = data.hand
      }
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
          <PlayerContainer>
            {/* {game.players.map((value, index) => (
              <div className="singlePlayer">
                <div className="singleBlocks">{Array(value.handSize).fill(<UnoCardBlock />)}</div>
                <h5>{value.name}</h5>
               
              </div>
            ))} */}
            {game.players.map((value) => {
              return value.id === user.id ? (
                ""
              ) : (
                <div className="singlePlayer">
                  <div className="singleBlocks">{Array(value.handSize).fill(<UnoCardBlock />)}</div>
                  <h5>{value.name}</h5>
                </div>
              )
            })}
          </PlayerContainer>

          <DeckContainer>
            <UnoCard playable="true" amount={deckSize}>
              <input type="button" onClick={() => handleDrawCard()} />
            </UnoCard>

            <UnoCard className={game.discardPile.card.color} playable="true" amount={game.discardPile.size}>
              <h4>{game.discardPile.card.number ? game.discardPile.card.number : game.discardPile.card.method}</h4>
            </UnoCard>
          </DeckContainer>

          <HandContainer>
            {/* <h3>Hand</h3> */}
            <Hand>
              {game.hand.map((value, index) => {
                return (
                  <UnoCard key={value.id} className={value.color} playable={value.isPlayable}>
                    <h4>{value.number ? value.number : value.method}</h4>
                    <input type="button" onClick={() => (value.isPlayable ? handlePlayCard(value) : null)} />
                  </UnoCard>
                )
              })}
            </Hand>
          </HandContainer>

          <Container hidden>
            <button onClick={() => handleLeaveGame()}>Leave Game</button>
          </Container>
        </RunningGame>
      ) : (
        <GameLobby>
          <Container>
            <PreTitle>Lobby</PreTitle>
            <Title>Uno</Title>
          </Container>
          <Container>
            <h3>Game Id</h3>
            <BlockContainer>
              <Block onClick={() => handleCopyClipboard()} ref={iconRef}>
                {game.id} <BiCopy />
              </Block>
            </BlockContainer>
          </Container>

          <Container>
            <Button onClick={handleStartGame} bgColor="#D9D9D9">
              Start Game
            </Button>
            <Button onClick={handleLeaveGame}>Leave Game</Button>
          </Container>
          <Container>
            <h3>Players</h3>
            <BlockContainer>
              {game.players.map((value, index) => (
                <Block key={index}>{value.name}</Block>
              ))}
            </BlockContainer>
          </Container>
        </GameLobby>
      )}
    </>
  )
}

export default Game
