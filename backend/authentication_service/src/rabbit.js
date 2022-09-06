import * as dotenv from "dotenv"
dotenv.config()

import amqp from "amqplib"

const amqpUser = process.env.AMQP_USER
const amqpPassword = process.env.AMQP_PASSWORD
const amqpHost = process.env.AMQP_HOST
const amqpPort = process.env.AMQP_PORT
const amqpUrl = `amqp://${amqpUser}:${amqpPassword}@${amqpHost}:${amqpPort}`

// RabbitMQ/amqplib code with added modifications from:
// https://github.com/FantasyGao/About_Node/tree/b5ef98f50a754034e2bdeeee66c4d2a36fc27d26/ES6Rabbit

// init
async function init(queue) {
  try {
    let connection = await amqp.connect(amqpUrl)

    connection.on("error", function (err) {
      console.log(err)
      setTimeout(init, 10000, queue)
    })

    connection.on("close", function () {
      console.error("connection to RabbitQM closed!")
      setTimeout(init, 10000, queue)
    })

    let channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    return channel
  } catch (e) {
    console.error("init error!")
    process.exit(1)
  }
}

// publisher
async function emitEvent(queue, msg) {
  const channel = await init(queue)
  await channel.sendToQueue(queue, Buffer.from(msg), {
    persistent: true,
  })
}

// consumer
async function onEvent(queue, callback) {
  try {
    const chan = await init(queue)
    await chan.consume(
      queue,
      function (msg) {
        chan.ack(msg)
        callback(msg.content.toString())
      },
      { noAck: false }
    )
  } catch (e) {
    callback(String(e))
  }
}

export { emitEvent, onEvent }
