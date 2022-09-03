import express from "express"
import amqplib from "amqplib"

const app = express()

const PORT = process.env.PORT || 8003

app.use(express.json())

// TODO: AMQP (RabbitMQ) connection

app.get("/", (req, res) => {
  res.send("authentication_service")
})

app.listen(PORT, () => {
  console.log(`authentication_service listening on port ${PORT}!`)
})
