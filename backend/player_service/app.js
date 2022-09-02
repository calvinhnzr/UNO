const express = require("express");
const amqp = require("amqplib");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

// TODO: AMQP (RabbitMQ) connection

app.get("/", (req, res) => {
  res.send("player_service");
});

app.listen(PORT, () => {
  console.log(`player_service listening on port ${PORT}!`);
});
