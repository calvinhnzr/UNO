import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Layout from "../components/styled/Layout"
import Title from "../components/styled/Title"
import Form from "../components/styled/Form"

import { fetchPOST } from "../helpers/fetchData.js"

const Login = () => {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()
  const url = "http://localhost:8000/api/game"

  async function submitHandler(e) {
    e.preventDefault()
    const body = {
      name: username,
    }
    const data = await fetchPOST(url, body)
    navigate(`/game/${data.id}`)
  }

  return (
    <Layout>
      <Title>Uni</Title>
      <Form onSubmit={submitHandler}>
        <label>
          <input
            type="text"
            required
            name={`Username`}
            value={username}
            placeholder="Nickname"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </Form>
    </Layout>
  )
}

export default Login
