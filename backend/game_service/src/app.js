import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"
import { nanoid } from "nanoid"

import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"

import { connect, sendRabbitMessage } from "./rabbit.js"

// socket.io setup
// #####################################

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
<<<<<<< HEAD
=======
    credentials: true,
>>>>>>> 2e2c1433fbd146bb373a9a14eab2c5520890b388
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

// amqp (rabbitmq) connection
// #####################################

start()
async function start() {
  await connect()
}

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
  sendRabbitMessage("userCreated", "Hello from game_service")
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
