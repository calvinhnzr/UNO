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
      "Client connected: " +
        socket.id +
        " with playerId: " +
        socket.decoded_token.id +
        " and playerName: " +
        socket.decoded_token.name
    )

    socket.on("join_room", (room) => {
      const game = games.find((game) => game.id === room)

      if (game) {
        const player = game.players.find((player) => player.id === socket.decoded_token.id)

        if (!player) {
          game.players.push({ id: socket.decoded_token.id, name: socket.decoded_token.name })

          socket.join(room)

          io.to(room).emit("player_joined", game.players)
        }
      }
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id)

      const game = games.find((game) => game.players.find((player) => player.id === socket.decoded_token.id))

      if (game) {
        const player = game.players.find((player) => player.id === socket.decoded_token.id)

        if (player) {
          game.players = game.players.filter((player) => player.id !== socket.decoded_token.id)
          socket.to(game.id).emit("player_left", game.players)
        }
      }
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
