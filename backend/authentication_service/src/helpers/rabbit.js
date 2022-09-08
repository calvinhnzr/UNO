import * as dotenv from "dotenv"
dotenv.config()

import jackrabbit from "@pager/jackrabbit"

import { consumeMessages } from "../app.js"

export const rabbit = jackrabbit(process.env.AMQP_URL)
const exchange = rabbit.default()
export const queue = exchange.queue({ name: "task_queue", durable: false })
const unpublishedMessages = []

export const initRabbit = () => {
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
}

export const publishMessage = (message) => {
  if (rabbit.isConnectionReady()) {
    console.log("[AMQP] Publishing message", message)
    exchange.publish(message, { key: "task_queue" })
  } else {
    console.log("[AMQP] RabbitMQ not connected, saving message for later")
    unpublishedMessages.push(message)
  }
}
