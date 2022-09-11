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

    socket.on("join_room", (room) => {
      const game = games.find((game) => game.id === room)

      if (game) {
        const player = game.players.find((player) => player.id === socket.decoded_token.id)

        if (!player) {
          game.players.push({ id: socket.decoded_token.id, name: socket.decoded_token.name })

          socket.join(room)

          io.to(room).emit("player_joined", game.players)
        } else {
          socket.emit("player_already_joined")
        }
      } else {
        socket.emit("error", "Game not found")
      }
    })

    socket.on("leave_room", (room) => {
      const game = games.find((game) => game.players.find((player) => player.id === socket.decoded_token.id))

      if (game) {
        const player = game.players.find((player) => player.id === socket.decoded_token.id)

        if (player) {
          game.players = game.players.filter((player) => player.id !== socket.decoded_token.id)

          if (game.players.length === 0) {
            games.splice(games.indexOf(game), 1)
            console.log("Game removed: " + game.id)
            console.log("All Games: " + games)
          } else {
            io.to(game.id).emit("player_left", game.players)
            console.log("Player left:", socket.decoded_token.id, socket.decoded_token.name)
          }

          socket.leave(game.id)
          console.log("Player " + player.name + " left room: " + game.id)
        }
      }
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id)
    })

    socket.on("send_message_room", (data) => {
      socket.to(data.room).emit("receive_message_room", data)
    })

    socket.on("send_message", (data) => {
      console.log("data in send_message", data)
      socket.broadcast.emit("receive_message", data)
    })
  })
}
