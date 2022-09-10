import { useState, useEffect, useContext } from "react"
import { useNavigate, Outlet } from "react-router-dom"

import { UserContext } from "../context/UserContext"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"
import Title from "../components/styled/Title"

import { fetchToken } from "../helpers/fetchToken"

const URL = "http://localhost:8001/api/player"

const Dashbaord = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)

  return (
    <Layout>
      <Container>
        <Title>User: {user.name}</Title>
        <p>{user.id}</p>
        <button onClick={() => console.log(user.id ? user : user)}>Get State</button>
        <button onClick={() => (localStorage.clear(), navigate("/", { replace: true }))}>Clear localStorage</button>
      </Container>
    </Layout>
  )
}

export default Dashbaord
