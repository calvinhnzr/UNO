import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

// helpers
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
    payload: { message: "Hello from rule_service" },
  })

  res.send("rule_service")
})

// server start

const PORT = process.env.PORT || 8002
httpServer.listen(PORT, () => {
  console.log(`rule_service listening on port ${PORT}!`)
})
