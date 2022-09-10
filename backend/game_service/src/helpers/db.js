import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

export const games = []

export class Game {
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
