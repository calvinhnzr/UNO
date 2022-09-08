import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

import jackrabbit from "@pager/jackrabbit"

// helpers
import { generateToken } from "./helpers/token.js"

// express middleware
// #####################################

app.use(cors())
app.use(express.json())

// amqp (rabbitmq) connection
// #####################################

const rabbit = jackrabbit(process.env.AMQP_URL)
const exchange = rabbit.default()
const queue = exchange.queue({ name: "task_queue", durable: false })
const unpublishedMessages = []

rabbit.on("connected", () => {
  console.log("[AMQP] RabbitMQ connection established")

  consumeMessages()
})

rabbit.on("reconnected", () => {
  console.log("[AMQP] RabbitMQ connection re-established")

  if (unpublishedMessages.length > 0) {
    unpublishedMessages.forEach((message) => {
      console.log("[AMQP] Publishing offline message")
      publishMessage(message)
    })
    unpublishedMessages.length = 0
  }

  consumeMessages()
})

const consumeMessages = () => {
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

const publishMessage = (message) => {
  if (rabbit.isConnectionReady()) {
    console.log("[AMQP] Publishing message", message)
    exchange.publish(message, { key: "task_queue" })
  } else {
    console.log("[AMQP] RabbitMQ not connected, saving message for later")
    unpublishedMessages.push(message)
  }
}

// express routes
// #####################################

app.get("/", (req, res) => {
  publishMessage({
    event: "test",
    payload: { message: "Hello from authentication_service" },
  })

  res.send("authentication_service")
})

// express server start
// #####################################

const PORT = process.env.PORT || 8003
app.listen(PORT, () => {
  console.log(`authentication_service listening on port ${PORT}!`)
})
