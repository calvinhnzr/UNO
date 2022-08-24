const express = require("express");
const amqp = require("amqplib");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// TODO: AMQP (RabbitMQ) connection

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Example app listening on port 3000!");
});
