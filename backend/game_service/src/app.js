import express from "express"
import amqplib from "amqplib"

const app = express()

const PORT = process.env.PORT || 8000

app.use(express.json())

// TODO: AMQP (RabbitMQ) connection

app.get("/", (req, res) => {
  res.send("game_service")
})

app.listen(PORT, () => {
  console.log(`game_service listening on port ${PORT}!`)
})
