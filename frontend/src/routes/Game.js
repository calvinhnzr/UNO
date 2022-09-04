import React from "react"
import { useParams } from "react-router-dom"

import WebSocket from "../components/WebSocket"

const Game = (props) => {
  const { id } = useParams()
  return (
    <div>
      <h1>My Game: {id}</h1>
      <WebSocket />
    </div>
  )
}

export default Game
