import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import io from "socket.io-client"

import "./styles/App.css"

import Login from "./routes/Login"
import AllGames from "./routes/AllGames"
import Game from "./routes/Game"
import NotFound from "./routes/NotFound"
import WebSocket from "./components/WebSocket"

import { socket, SocketContext } from "./context/socket"

function App() {
  const [socket, setSocket] = useState(null)
  const [lastPong, setLastPong] = useState(null)

  useEffect(() => {
    const newSocket = io(`http://localhost:8000`)
    setSocket(newSocket)

    newSocket.on("pong", () => {
      setLastPong(new Date().toISOString())
    })

    return () => {
      newSocket.close()
      newSocket.off("pong")
    }
  }, [setSocket])

  const sendPing = () => {
    socket.emit("ping")
  }

  return (
    <>
      <h1>Hallo</h1>
      {socket ? <p>conntected</p> : <p>not conntected</p>}
      <p>Last pong: {lastPong || "-"}</p>

      <button onClick={sendPing}>Send ping</button>
      {/* <WebSocket /> */}
    </>

    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/game">
    //       <Route index element={<AllGames />} />
    //       <Route path=":id" element={<Game />} />
    //     </Route>
    //     <Route path="*" element={<NotFound />} />
    //   </Routes>
    // </BrowserRouter>
  )
}

export default App
