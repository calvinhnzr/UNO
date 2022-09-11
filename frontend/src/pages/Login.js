import { useState, useEffect, useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"
import Title from "../components/styled/Title"
import Form from "../components/styled/Form"

import { saveToStorage } from "../helpers/saveToStorage"

import { fetchPOST } from "../helpers/fetchData.js"

import { Context } from "../context/Context"

const Login = () => {
  let navigate = useNavigate()

  const url = "http://localhost:8001/api/player"

  const [name, setName] = useState("")
  const { user, setUser } = useContext(Context)

  async function submitHandler(e) {
    e.preventDefault()
    const body = {
      name,
    }
    const data = await fetchPOST(url, body)

    saveToStorage("token", data.token)
    saveToStorage("name", data.player.name)
    saveToStorage("id", data.player.id)

    // save info to context
    user.token = data.token
    user.name = data.player.name
    user.id = data.player.id
    user.auth = true
    setUser({ ...user })
    navigate(`/`)
  }

  // TODO: Protected Routes

  return (
    <Layout>
      <Container>
        <Title>Name: {name}</Title>
        <Form onSubmit={submitHandler}>
          <label>
            <input
              type="text"
              required
              name={`Username`}
              value={name}
              placeholder="Nickname"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button type="submit">Login</button>
        </Form>
      </Container>
      <Container>
        <button onClick={() => console.log(user)}>Get State</button>
        <button onClick={() => localStorage.clear()}>Clear localStorage</button>
      </Container>
    </Layout>
  )
}

export default Login
