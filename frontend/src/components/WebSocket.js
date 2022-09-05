import { useState, useEffect } from "react"
import io from "socket.io-client"

const WebSocket = () => {
  const [socket, setSocket] = useState(null)
  const [lastPong, setLastPong] = useState(null)

  useEffect(() => {
    const newSocket = io(`http://localhost:8000`)
    setSocket(newSocket)

    newSocket.on("pong", () => {
      setLastPong(new Date().toISOString())
    })

    return () => {
      newSocket.off("pong")
      newSocket.close()
    }
  }, [setSocket])

  const sendPing = () => {
    socket.emit("ping")
  }

  return (
    <div>
      {socket ? <p>conntected</p> : <p>not conntected</p>}
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
  )
}

export default WebSocket
