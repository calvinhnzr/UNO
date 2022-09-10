import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"

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

  startSocketIO(io)

  return httpServer
}

export const startSocketIO = (io) => {
  // io.on("connection", (socket) => {
  //   console.log("Client connected: " + socket.id)

  //   socket.on("ping", (message) => {
  //     // console.log("ping received", message)
  //     socket.emit("pong", "game_service")
  //   })
  // })

  io.on("connection", (socket) => {
    console.log("Client connected: " + socket.id)

    // socket.on("ping", () => {
    //   console.log("ping received")
    //   socket.emit("pong", "test")
    // })

    socket.on("join_room", (room, callback) => {
      socket.join(room)
      callback(`Joined Room: ${room}`)
    })

    socket.on("send_message_room", (data) => {
      console.log("A", data)
      console.log("B", data.room)
      socket.to(data.room)
      socket.to(data.room).emit("receive_message_room", data)
    })

    socket.on("send_message", (data) => {
      console.log(data)
      socket.broadcast.emit("receive_message", data)
      // socket.emit("receive_message", data)
    })
  })

  // do other stuff
}
