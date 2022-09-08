import React from "react"
import { useParams } from "react-router-dom"

const Game = (props) => {
  const { id } = useParams()
  return (
    <div>
      <h1>My Game: {id}</h1>
    </div>
  )
}

export default Game
