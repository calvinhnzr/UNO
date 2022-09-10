import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

// helpers
import { games, Game } from "./helpers/db.js"
import { initRabbit, publishMessage, rabbit, queue } from "./helpers/rabbit.js"
import { authenticateToken } from "./helpers/authenticateToken.js"

// socketio
import { initSocketIO } from "./helpers/socketio.js"
const httpServer = initSocketIO(app)

// rabbitmq connection

initRabbit()

export const consumeMessages = () => {
  queue.consume((message, ack, nack) => {
    // ADD CUSTOM EVENTS BELOW
    if (message.event === "test") {
      console.log("[AMQP] Message received", message)
      ack()
      return
    }
    nack()
    return
  })
}

// middleware

app.use(cors())
app.use(express.json())

// routes

app.get("/", (req, res) => {
  publishMessage({
    event: "test",
    payload: { message: "Hello from game_service" },
  })

  res.send("game_service")
})

app.get("/api/game", (req, res) => {
  res.json(games)
})

app.put("/api/game/:id", authenticateToken, (req, res) => {
  const game = games.find((game) => game.id === req.params.id)

  const playerId = req.user.id
  const playerName = req.user.name

  if (game) {
    game.players.push({ id: playerId, name: playerName })

    return res.json(game)
  } else {
    return res.status(404).json({ error: "Game not found" })
  }
})

app.post("/api/game", authenticateToken, (req, res) => {
  const playerId = req.user.id
  const playerName = req.user.name || "Anonymous"
  const game = new Game()

  game.addPlayer({ id: playerId, name: playerName })

  games.push(game)

  res.json(game)
})

// server start

const PORT = process.env.PORT || 8000
httpServer.listen(PORT, () => {
  console.log(`game_service listening on port ${PORT}!`)
})
