import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import io from "socket.io-client"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"

const socket = io.connect(`http://localhost:8000`, { query: `token=${localStorage.getItem("token")}` })

const Game = (props) => {
  const { user, setUser } = useContext(UserContext)

  const [room, setRoom] = useState("")
  const [message, setMessage] = useState("")
  const [messageReceived, setmessageReceived] = useState("")

  const sendMessage = () => {
    socket.emit("send_message", { message })
  }

  const sendMessageRoom = () => {
    socket.emit("send_message_room", { message, room })
  }

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", user.gameId, (message) => {
        console.log(message)
      })
    }
  }

  useEffect(() => {
    socket.io.opts.query = `token=${localStorage.getItem("token")}`
    socket.connect()

    setRoom(user.gameId)
    socket.on("receive_message", (data) => {
      setmessageReceived(data.message)
    })

    socket.on("receive_message_room", (data) => {
      setmessageReceived(data.message)
    })

    socket.emit("join_room", user.gameId, (message) => {
      console.log(message)
    })
  }, [socket])

  return (
    <Layout>
      <Container>
        <h1>My Game: {user.gameId}</h1>
      </Container>

      <Container>
        <input placeholder="Message" onChange={(e) => setMessage(e.target.value)} />
        <input placeholder="Room" onChange={(e) => setRoom(e.target.value)} />
        <button onClick={sendMessage}>Send Message as Broadcast</button>
        <br />
        <button onClick={joinRoom}>Join Room</button>
        <button onClick={sendMessageRoom}>Send Message to Room</button>
        <h1>Message: </h1>
        {messageReceived}
      </Container>
    </Layout>
  )
}

export default Game
