import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom"
import { useState, useEffect, useContext } from "react"

import "./styles/App.css"

import { Context } from "./context/Context"
import { getFromStorage } from "./helpers/saveToStorage"

import PrivateRoutes from "./pages/PrivateRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Nav from "./components/Nav"

import AllGames from "./pages/AllGames"
import Game from "./pages/Game"
import RunningGame from "./pages/RunningGame"
import NotFound from "./pages/NotFound"

function App() {
  // saved in storage:
  const [user, setUser] = useState({ name: "", token: "", id: "", auth: false, gameId: "", hasStarted: false })
  // saved in state:
  const [game, setGame] = useState({ id: "", joined: false, started: false, players: [""], hand: [] })

  useEffect(() => {
    user.token = getFromStorage("token")
    user.name = getFromStorage("name")
    user.id = getFromStorage("id")
    // user.auth = getFromStorage("token") ? true : false
    // user.gameId = getFromStorage("gameId")
    setUser({ ...user })
  }, [])

  return (
    <>
      <BrowserRouter>
        <Nav gameId={user.gameId} />
        <Context.Provider value={{ user, setUser, game, setGame }}>
          <Routes>
            <Route path="/" element={user.token ? <Dashboard /> : <Login />} />
            <Route path="/game">
              <Route index element={<AllGames />} />
              {/* <Route path=":id" element={<Game />} /> */}
              <Route path={`${game.id}`} element={<Game />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Context.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
