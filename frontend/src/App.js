import "./styles/App.css"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Login from "./routes/Login"
import AllGames from "./routes/AllGames"
import Game from "./routes/Game"
import NotFound from "./routes/NotFound"

function MyGame() {}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/game">
          <Route index element={<AllGames />} />
          <Route path=":id" element={<Game />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
