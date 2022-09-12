import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

export const games = []

export class Game {
  constructor() {
    this.id = nanoid(5)
    this.players = []
    this.started = false
    this.deck = new Deck()
    this.deck.create()
    this.deck.shuffle()
    this.discardPile = []
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

class Card {
  constructor(color, number, method) {
    this.color = color
    this.number = number
    this.method = method
    this.id
  }
}

export class Deck {
  constructor(cards = []) {
    this.cards = cards
  }

  create() {
    let colors = ["blue", "red", "yellow", "green"]
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    // let methods = ["draw2", "reverse", "skip"]

    // create color cards without
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < colors.length; j++) {
        for (let k = 0; k < numbers.length; k++) {
          this.cards.push(new Card(colors[j], numbers[k], null))
        }
      }
    }

    // create 0 cards
    for (let i = 0; i < 4; i++) {
      this.cards.push(new Card(colors[i], 0, null))
    }

    // create action cards
    for (let m = 0; m < 2; m++) {
      for (let n = 0; n < colors.length; n++) {
        this.cards.push(new Card(colors[n], null, "skip"))
        this.cards.push(new Card(colors[n], null, "reverse"))
        this.cards.push(new Card(colors[n], null, "draw2"))
      }
    }

    // create wild cards
    for (let i = 0; i < 4; i++) {
      this.cards.push(new Card("black", null, "wild"))
      this.cards.push(new Card("black", null, "draw4"))
    }

    // generate id for each card
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].id = i
    }

    this.shuffle()
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  draw() {
    return this.cards.pop()
  }

  size() {
    return this.cards.length
  }
}

// const myDeck = new Deck()

// console.log(myDeck)
