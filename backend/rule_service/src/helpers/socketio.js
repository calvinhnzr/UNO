import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"
import socketioJwt from "socketio-jwt"

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
    console.log("Client connected: " + socket.id)

    socket.on("check_hand", (data) => {
      const hand = data.hand
      const discardPileCard = data.discardPileCard.card
      // hallo?
      for (let i = 0; i < hand.length; i++) {
        hand[i].isPlayable = checkCardIfPlayable(hand[i], discardPileCard)
      }

      io.to(socket.id).emit("checked_hand", data.hand)
    })
  })
}

const checkCardIfPlayable = (card, discardPileCard) => {
  // check if one card is a wild card
  if (
    (card.color !== "black" && discardPileCard.color === "black") ||
    (card.color === "black" && discardPileCard.color !== "black")
  ) {
    return true
  }

  // check for special cards
  if (card.method === "drawTwo" && discardPileCard.method === "drawTwo") {
    return true
  }

  if (card.method === "skip" && discardPileCard.method === "skip") {
    return true
  }

  if (card.method === "reverse" && discardPileCard.method === "reverse") {
    return true
  }

  // compare colors
  if (card.color === discardPileCard.color) {
    if (card.color === "black") {
      return false
    }
    return true
  }

  // compare numbers
  // not including special cards
  if (card.number) {
    if (card.number === discardPileCard.number) {
      return true
    }
  }

  return false
}
