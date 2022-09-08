import { nanoid } from "nanoid"

export const players = []

export class Player {
  constructor(name) {
    this.id = nanoid(5)
    this.name = name
  }
}
