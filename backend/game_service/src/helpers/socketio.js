import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"

export const initSocketIO = (app) => {
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io", "https://www.piesocket.com"],
    },
  })

  instrument(io, {
    auth: false,
  })

  startSocketIO(io)

  return httpServer
}

export const startSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected: " + socket.id)

    socket.on("ping", (message) => {
      console.log("ping received", message)
      socket.emit("pong", "player_service")
    })
  })

  // do other stuff
}
