import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import io from "socket.io-client"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"

// const socket = io.connect(`http://localhost:8000`, { query: `token=OlUJn` })
const socket = io.connect(`http://localhost:8000`)
// let socket

const Game = () => {
  const { user, setUser } = useContext(UserContext)

  const [room, setRoom] = useState("")

  const [message, setMessage] = useState("")
  const [messageReceived, setmessageReceived] = useState("")

  const [joinedPlayers, setJoinedPlayers] = useState()

  const sendMessageRoom = () => {
    socket.emit("send_message_room", { message, room })
  }

  useEffect(() => {
    socket.io.opts.query = `token=${localStorage.getItem("token")}`
    socket.connect()
    // socket = io.connect(`http://localhost:8000`, {
    //   query: `token=${localStorage.getItem("token")}`,
    // })

    setRoom(user.gameId)

    socket.emit("join_room", user.gameId)

    socket.on("player_joined", (data) => {
      console.log("A Player joined")
      setJoinedPlayers(data)
    })

    socket.on("receive_message_room", (data) => {
      setmessageReceived(data.message)
    })

    socket.on("player_left", (data) => {
      console.log("A Player left")
      setJoinedPlayers(data)
    })
  }, [socket])

  return (
    <Layout>
      <Container>
        <h1>My Game: {user.gameId}</h1>
      </Container>

      <Container>
        <input placeholder="Message" onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessageRoom}>Send Message to Room</button>
      </Container>

      <Container>
        <h1>Message: </h1>
        {messageReceived}
      </Container>

      <Container>
        <h2>Players:</h2>
        {joinedPlayers ? joinedPlayers.map((value, index) => <p key={index}>{value.name}</p>) : ""}
      </Container>
    </Layout>
  )
}

export default Game
