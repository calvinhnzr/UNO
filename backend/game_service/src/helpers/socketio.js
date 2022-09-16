import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"
import socketioJwt from "socketio-jwt"

// helpers
import { games, Deck } from "./db.js"
import { publishMessage } from "./rabbit.js"

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
          game.players.push({ id: socket.decoded_token.id, name: socket.decoded_token.name, hand: [] })

          socket.join(gameId)
        }

        // remove the hand from each player and add the size of the hand instead
        const players = game.players.map((player) => {
          const { hand, ...rest } = player
          return { ...rest, handSize: hand.length }
        })

        io.to(gameId).emit("player_joined", players)
      } else {
        console.log("Game not found")
      }
    })

    socket.on("leave_game", (gameId) => {
      let game = games.find((game) => game.id === gameId)

      if (game) {
        game.players = game.players.filter((player) => player.id !== socket.decoded_token.id)

        if (game.players.length === 0) {
          games.splice(games.indexOf(game), 1)
        }

        io.to(gameId).emit("player_left", game.players)
      } else {
        console.log("Game not found")
      }
    })

    socket.on("start_game", (gameId) => {
      const game = games.find((game) => game.id === gameId)

      if (game) {
        if (!game.started) {
          game.started = true

          // draw 7 cards for each player
          game.players.forEach((player) => {
            for (let i = 0; i < 7; i++) {
              player.hand.push(game.deck.draw())
            }
          })

          // draw 1 card for the discard pile
          game.discardPile.push(game.deck.draw())

          io.to(gameId).emit("game_started", {
            started: game.started,
          })

          io.to(gameId).emit("deck_size_updated", game.deck.size())

          io.to(gameId).emit("discard_pile_updated", {
            card: game.discardPile[game.discardPile.length - 1],
            size: game.discardPile.length,
          })
        } else {
          console.log("Game already started")

          io.to(gameId).emit("game_started", {
            error: "Game already started",
          })
        }

        const allClients = io.sockets.adapter.rooms.get(gameId)

        // remove the hand from each player and add the size of the hand instead
        const players = game.players.map((player) => {
          const { hand, ...rest } = player
          return { ...rest, handSize: hand.length }
        })

        // send hand to each player by socket id
        game.players.forEach((player) => {
          const socketId = [...allClients].find((socketId) => {
            const socket = io.sockets.sockets.get(socketId)
            return socket.decoded_token.id === player.id
          })

          io.to(socketId).emit("get_hands", { hand: player.hand, players })
        })
      } else {
        console.log("Game not found")
      }
    })

    socket.on("play_card", (card, gameId) => {
      const game = games.find((game) => game.id === gameId)

      if (game) {
        const player = game.players.find((player) => player.id === socket.decoded_token.id)

        if (player) {
          //
          const cardIndex = player.hand.findIndex((c) => c.id === card.id)

          if (cardIndex !== -1) {
            player.hand.splice(cardIndex, 1)

            game.discardPile.push(card)

            // check if the player has won
            if (player.hand.length === 0) {
              game.started = false

              // reset player hands
              game.players.forEach((player) => {
                player.hand = []
              })

              // reset deck
              game.deck = new Deck()
              game.deck.create()
              game.deck.shuffle()

              // reset discard pile
              game.discardPile = []

              io.to(gameId).emit("game_ended", { started: game.started, winner: player.name })

              // send rabbitmq event to player service to update the player's score
              publishMessage({ event: "updatePlayerScore", payload: { name: player.name } })

              return
            }

            // remove the hand from each player and add the size of the hand instead
            const players = game.players.map((player) => {
              const { hand, ...rest } = player
              return { ...rest, handSize: hand.length }
            })

            io.to(gameId).emit("played_card", {
              playerId: player.id,
              players,
            })

            io.to(gameId).emit("deck_size_updated", game.deck.size())

            io.to(gameId).emit("discard_pile_updated", {
              card: game.discardPile[game.discardPile.length - 1],
              size: game.discardPile.length,
            })

            // send updated hand to player who played the card
            io.to(socket.id).emit("get_hands", { hand: player.hand, players })
          }
        }
      } else {
        console.log("Game not found")
      }
    })

    socket.on("draw_card", (gameId) => {
      const game = games.find((game) => game.id === gameId)

      if (game) {
        const player = game.players.find((player) => player.id === socket.decoded_token.id)

        if (player) {
          // draw a card
          if (game.deck.size() > 0) {
            player.hand.push(game.deck.draw())
          }

          // check if the deck is empty
          if (game.deck.size() === 0) {
            const lastCard = game.discardPile.pop()
            game.deck = new Deck(game.discardPile)
            game.deck.shuffle()
            game.discardPile = [lastCard]
          }

          // remove the hand from each player and add the size of the hand instead
          const players = game.players.map((player) => {
            const { hand, ...rest } = player
            return { ...rest, handSize: hand.length }
          })

          io.to(gameId).emit("get_hands", { players })
          // send updated hand to player who drew a card
          io.to(socket.id).emit("get_hands", { hand: player.hand, players })

          io.to(gameId).emit("deck_size_updated", game.deck.size())

          io.to(gameId).emit("discard_pile_updated", {
            card: game.discardPile[game.discardPile.length - 1],
            size: game.discardPile.length,
          })
        }
      } else {
        console.log("Game not found")
      }
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id)

      let game = games.find((game) => game.players.find((player) => player.id === socket.decoded_token.id))
      console.log(game)

      if (game) {
        game.players = game.players.filter((player) => player.id !== socket.decoded_token.id)

        if (game.players.length === 0) {
          games.splice(games.indexOf(game), 1)
        }

        io.to(game.id).emit("player_left", game.players)
      }

      socket.disconnect()
    })
  })
}
