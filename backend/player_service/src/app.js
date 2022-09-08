import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

// helpers
import { setNewPlayerToken, ensureTokenIsSet, resetPlayerToken } from "./helpers/waitForToken.js"
import { players, Player } from "./helpers/db.js"
import { initRabbit, publishMessage, rabbit, queue } from "./helpers/rabbit.js"

// socketio
import { initSocketIO } from "./helpers/socketio.js"
const httpServer = initSocketIO(app)

// rabbitmq connection

initRabbit()

export const consumeMessages = () => {
  queue.consume((message, ack, nack) => {
    // ADD CUSTOM EVENTS BELOW
    if (message.event === "playerToken") {
      console.log("[AMQP] Message received", message)

      setNewPlayerToken(message.payload.token)

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
  publishMessage({ event: "test", payload: { message: "Hello from player_service" } })

  res.send("player_service")
})

app.post("/api/player", async (req, res) => {
  const name = req.body.name || "Anonymous"
  let token

  const player = new Player(name)

  publishMessage({ event: "newPlayer", payload: { id: player.id, name: player.name } })

  if (rabbit.isConnectionReady()) {
    try {
      token = await ensureTokenIsSet()
      resetPlayerToken()
      players.push(player)
      return res.status(200).json({ token, player })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  } else {
    token = ""
  }

  res.status(500).json({ error: "Internal server error. RabbitMQ connection is not ready." })
})

// server start

const PORT = process.env.PORT || 8001
httpServer.listen(PORT, () => {
  console.log(`player_service listening on port ${PORT}!`)
})
