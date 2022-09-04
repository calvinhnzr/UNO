import express from "express"
const app = express()
import cors from "cors"
import { nanoid } from "nanoid"
import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

const games = []

class Game {
  constructor() {
    this.id = nanoid(10)
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
    this.id = nanoid(10)
    this.name = name
  }
}

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
