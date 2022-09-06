import * as dotenv from "dotenv"
dotenv.config()
import amqp from "amqplib"

let channel
let connection

const amqpUrl = process.env.AMQP_URL

async function connect() {
  try {
    connection = await amqp.connect(amqpUrl)
    channel = await connection.createChannel()

    await channel.assertQueue("player_service", { durable: false })
  } catch (err) {
    console.log(err)
  }

  channel.consume(
    "player_service",
    (msg) => {
      const data = msg.content.toString()
      console.log(" [x] Received %s", data)
      channel.ack(msg)
    },
    { noAck: false }
  )
}

function sendRabbitMessage(queue, msg) {
  channel.sendToQueue(queue, Buffer.from(msg))
}

export { connect, sendRabbitMessage }
