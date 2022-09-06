import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

import jwt from "jsonwebtoken"

import { connect, sendRabbitMessage } from "./rabbit.js"

// express middleware
// #####################################

app.use(cors())
app.use(express.json())

// amqp (rabbitmq) connection
// #####################################

start()
async function start() {
  await connect()
}

// express routes
// #####################################

app.get("/", (req, res) => {
  sendRabbitMessage(
    "authentication_service",
    "hello from authentication_service"
  )
  res.send("authentication_service")
})

// express server start
// #####################################

const PORT = process.env.PORT || 8003
app.listen(PORT, () => {
  console.log(`authentication_service listening on port ${PORT}!`)
})
