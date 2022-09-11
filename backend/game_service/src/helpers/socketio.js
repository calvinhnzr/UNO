import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"
import socketioJwt from "socketio-jwt"

// helpers
import { games } from "./db.js"

export const initSocketIO = (app) => {
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io"],
    },
  })

  instrument(io, {
    auth: false,
  })

  io.use(
    socketioJwt.authorize({
      secret: process.env.JWT_SECRET,
      handshake: true,
    })
  )

  startSocketIO(io)

  return httpServer
}

export const startSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `Client connected: ${socket.id} with playerId: ${socket.decoded_token.id} and playerName: ${socket.decoded_token.name}`
    )

    socket.on("join_game", (gameId) => {
      const game = games.find((game) => game.id === gameId)

      if (game) {
        const player = game.players.find((player) => player.id === socket.decoded_token.id)

        if (!player) {
          game.players.push({ id: socket.decoded_token.id, name: socket.decoded_token.name })

          socket.join(gameId)
        }

        io.to(gameId).emit("player_joined", game.players)
      } else {
        console.log("Game not found")
      }
    })

    socket.on("leave_game", (gameId) => {
      let game = games.find((game) => game.id === gameId)

      if (game) {
        game.players = game.players.filter((player) => player.id !== socket.decoded_token.id)

        // io.in(socket.id).socketsLeave(gameId)

        if (game.players.length === 0) {
          games.splice(games.indexOf(game), 1)
        }

        io.to(gameId).emit("player_left", game.players)
      } else {
        console.log("Game not found")
      }
      // socket.disconnect()
    })

    socket.on("start_game", (gameId) => {
      const game = games.find((game) => game.id === gameId)

      if (game) {
        game.started = true

        io.to(gameId).emit("game_started", game)
      } else {
        console.log("Game not found")
      }
    })

    // socket.on("send_message_room", (data) => {
    //   socket.to(data.room).emit("receive_message_room", data)
    // })

    // socket.on("send_message", (data) => {
    //   console.log("data in send_message", data)
    //   socket.broadcast.emit("receive_message", data)
    // })

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id)

      let game = games.find((game) => game.players.find((player) => player.id === socket.decoded_token.id))
      console.log(game)

      game.players = game.players.filter((player) => player.id !== socket.decoded_token.id)

      if (game.players.length === 0) {
        games.splice(games.indexOf(game), 1)
      }

      io.to(game.id).emit("disconnect_from_socket", game.players)

      socket.disconnect()
    })
  })
}
