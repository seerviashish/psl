import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar'

const Layout: React.FC = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  )
}

export default Layout
