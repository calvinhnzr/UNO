import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom"
import { useState, useEffect, useContext } from "react"

import "./styles/App.css"

import { UserContext } from "./context/UserContext"
import { getFromStorage } from "./helpers/saveToStorage"

import PrivateRoutes from "./pages/PrivateRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Nav from "./components/Nav"

import AllGames from "./pages/AllGames"
import Game from "./pages/Game"
import NotFound from "./pages/NotFound"

const URL = "http://localhost:8001/api/player"

function App() {
  const [user, setUser] = useState({ name: "", token: "", id: "", auth: false, gameId: "" })

  useEffect(() => {
    user.token = getFromStorage("token")
    user.name = getFromStorage("name")
    user.id = getFromStorage("id")
    user.auth = getFromStorage("token") ? true : false
    user.gameId = getFromStorage("gameId")
    setUser({ ...user })
  }, [])

  return (
    <>
      <BrowserRouter>
        <Nav gameId={user.gameId} />
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={user.token ? <Dashboard /> : <Login />} />
            <Route path="/game">
              <Route index element={<AllGames />} />
              {/* <Route path=":id" element={<Game />} /> */}
              <Route path={`${user.gameId}`} element={<Game />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
