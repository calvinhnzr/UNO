import express from "express"
const app = express()
import cors from "cors"
import { nanoid } from "nanoid"
import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket"],
  },
})

instrument(io, {
  auth: false,
})

app.use(cors())
app.use(express.json())

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

const PORT = process.env.PORT || 8000
httpServer.listen(PORT, () => {
  console.log(`game_service listening on port ${PORT}!`)
})

io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id)

  socket.on("ping", () => {
    console.log("ping received")
    socket.emit("pong", "test")
  })
})
