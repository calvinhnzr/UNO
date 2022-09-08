import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

// helpers
import { games, Game } from "./helpers/db.js"
import { initRabbit, publishMessage, rabbit, queue } from "./helpers/rabbit.js"

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

app.get("/api/game/:id", (req, res) => {
  const game = games.find((g) => g.id === req.params.id)

  if (game) {
    res.json(game)
  } else {
    res.status(404).end()
  }
})

app.post("/api/game", (req, res) => {
  const name = req.body.name || "Anonymous"
  const game = new Game()
  const player = new Player(name)

  game.addPlayer(player)

  games.push(game)

  res.json(game)
})

// server start

const PORT = process.env.PORT || 8000
httpServer.listen(PORT, () => {
  console.log(`game_service listening on port ${PORT}!`)
})
