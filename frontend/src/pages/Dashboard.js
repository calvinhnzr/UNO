import { useState, useEffect, useContext } from "react"

import { UserContext } from "../context/UserContext"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"
import Title from "../components/styled/Title"

import { fetchToken } from "../helpers/fetchToken"

const URL = "http://localhost:8001/api/player"

const Dashbaord = () => {
  const { user, setUser } = useContext(UserContext)

  return (
    <Layout>
      <Container>
        <Title>User: </Title>
        <p>{user}</p>
        {/* <button onClick></button> */}
      </Container>
    </Layout>
  )
}

export default Dashbaord
