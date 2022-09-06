import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

import jwt from "jsonwebtoken"

import { emitEvent, onEvent } from "./rabbit.js"

// express middleware
// #####################################

app.use(cors())
app.use(express.json())

// amqp (rabbitmq) connection
// #####################################

const q = "testEvent"
emitEvent(q, JSON.stringify({ id: 12345, name: "testUser" }))

setInterval(() => {
  console.info(" [x] Sending event...")
  emitEvent(q, JSON.stringify({ id: 12345, name: "testUser" }))
}, 3000)

onEvent(q, (msg) => {
  console.log(" [x] Received event: ", q, JSON.parse(msg))
})

// express routes
// #####################################

app.get("/", (req, res) => {
  res.send("authentication_service")
})

// express server start
// #####################################

const PORT = process.env.PORT || 8003
app.listen(PORT, () => {
  console.log(`authentication_service listening on port ${PORT}!`)
})
