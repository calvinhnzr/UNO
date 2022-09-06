import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"
import { nanoid } from "nanoid"

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
emitEvent(q, JSON.stringify({ id: nanoid(5), name: "testUser" }))

setInterval(() => {
  console.info(" [x] Sending event...")
  emitEvent(q, JSON.stringify({ id: nanoid(5), name: "testUser" }))
}, 3000)

onEvent(q, (msg) => {
  console.log(" [x] Received event: ", q, JSON.parse(msg))
})

// data
// #####################################

const games = []

class Game {
  constructor() {
    this.id = nanoid(5)
    this.players = []
  }

  addPlayer(player) {
    this.players.push(player)
  }

  removePlayer(player) {
    this.players = this.players.filter((p) => p.id !== player.id)
  }

  getPlayers() {
    return this.players
  }
}

class Player {
  constructor(name) {
    this.id = nanoid(5)
    this.name = name
  }
}

// express routes
// #####################################

app.get("/", (req, res) => {
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

// express server start
// #####################################

const PORT = process.env.PORT || 8000
httpServer.listen(PORT, () => {
  console.log(`game_service listening on port ${PORT}!`)
})

// socket.io events
// #####################################

io.on("connection", (socket) => {
  games.forEach((game) => {
    socket.join(game.id)
  })

  socket.on("playCard", ({ message, room }) => {
    console.log("playCard", message, room)
  })

  console.log("Client connected: " + socket.id)

  socket.on("ping", () => {
    console.log("ping received")
    socket.emit("pong", "game_service")
  })
})
