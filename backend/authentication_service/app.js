const express = require("express");
const amqp = require("amqplib");

const app = express();

const PORT = process.env.PORT || 3003;

app.use(express.json());

// TODO: AMQP (RabbitMQ) connection

app.get("/", (req, res) => {
  res.send("auth_service");
});

app.listen(PORT, () => {
  console.log(`auth_service listening on port ${PORT}!`);
});
