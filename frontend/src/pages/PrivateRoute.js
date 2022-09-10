import { Navigate, Outlet } from "react-router-dom"

const PrivateRoutes = (props) => {
  console.log("token:" + props.token)

  return props.token ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
