import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"
import socketioJwt from "socketio-jwt"

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

    socket.on("join_room", (room, callback) => {
      socket.join(room)
      callback(`Joined Room: ${room}`)
    })

    socket.on("send_message_room", (data) => {
      console.log("data in send_message_room", data)
      console.log("data.room in send_message_room", data.room)
      socket.to(data.room)
      socket.to(data.room).emit("receive_message_room", data)
    })

    socket.on("send_message", (data) => {
      console.log("data in send_message", data)
      socket.broadcast.emit("receive_message", data)
    })
  })
}
