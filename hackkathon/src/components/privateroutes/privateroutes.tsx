

import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
const ProtectedRoute = ({ children }) => {

  const token = Cookies.get("token")
  console.log(token)

  if (token === undefined) {
    return <Navigate to="/login" />
  }
  return children
}

export default ProtectedRoute








