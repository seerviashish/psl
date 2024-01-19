import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth'

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout?.().then(() => {
      navigate('/auth?form=signIn')
    })
  }

  return (
    <nav className="flex justify-end gap-1">
      {isAuthenticated && (
        <ul>
          <li className="m-2 self-center rounded-md border-2 p-2 text-xl">
            <Link to="/">Home</Link>
          </li>
        </ul>
      )}
      {isAuthenticated && (
        <button
          className="m-2 self-center rounded-md border-2 bg-red-400 p-2 text-xl"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </nav>
  )
}

export default Navbar
