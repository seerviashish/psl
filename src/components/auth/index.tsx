import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/auth'

interface IAuth {
  children: React.ReactNode
}

const Auth: React.FC<IAuth> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)
  const location = useLocation()

  return isAuthenticated === true ? (
    children
  ) : (
    <Navigate
      to="/auth?form=signIn"
      replace
      state={{ path: location.pathname }}
    />
  )
}

export default Auth
