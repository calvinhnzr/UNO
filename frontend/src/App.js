import "./styles/App.css"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Login from "./routes/Login"
import Game from "./routes/Game"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
