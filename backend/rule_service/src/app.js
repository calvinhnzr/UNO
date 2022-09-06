import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"

import { emitEvent, onEvent } from "./rabbit.js"

// socket.io setup
// #####################################

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
  },
})

// admin ui
instrument(io, {
  auth: false,
})

// express middleware
// #####################################

app.use(cors())
app.use(express.json())

// amqp (rabbitmq) event handling
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
  res.send("rule_service")
})

// express server start
// #####################################

const PORT = process.env.PORT || 8002
app.listen(PORT, () => {
  console.log(`rule_service listening on port ${PORT}!`)
})

// socket.io events
// #####################################

io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id)

  socket.on("ping", () => {
    console.log("ping received")
    socket.emit("pong", "rule_service")
  })
})
