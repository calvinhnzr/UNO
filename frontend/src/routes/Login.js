import { useState } from "react"

import Layout from "../components/styled/Layout"
import Title from "../components/styled/Title"
import Form from "../components/styled/Form"

const Login = () => {
  const [username, setUsername] = useState("")

  function submitHandler(e) {
    e.preventDefault()
    console.log(username)
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
