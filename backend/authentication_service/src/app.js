import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

// helpers
import { generateToken } from "./helpers/token.js"
import { initRabbit, publishMessage, rabbit, queue } from "./helpers/rabbit.js"

// rabbitmq connection

initRabbit()

export const consumeMessages = () => {
  queue.consume((message, ack, nack) => {
    // ADD CUSTOM EVENTS BELOW
    if (message.event === "newPlayer") {
      console.log("[AMQP] Message received", message)
      const token = generateToken(message.payload)

      publishMessage({
        event: "playerToken",
        payload: {
          token,
          player: message.payload,
        },
      })

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
    payload: { message: "Hello from authentication_service" },
  })

  res.send("authentication_service")
})

// server start

const PORT = process.env.PORT || 8003
app.listen(PORT, () => {
  console.log(`authentication_service listening on port ${PORT}!`)
})
