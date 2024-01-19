import { Route, Routes } from 'react-router-dom'
import Auth from '../components/auth'
import AuthPage from './auth'
import HomePage from './home'
import Layout from './layout'
import Tenant from './tenant'
import TenantNew from './tenant/new'
import TenantView from './tenant/view'

const PageRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route
          path=""
          element={
            <Auth>
              <HomePage />
            </Auth>
          }
        />
        <Route
          path="users"
          element={
            <Auth>
              <HomePage />
            </Auth>
          }
        />
        <Route
          path="tenant"
          element={
            <Auth>
              <Tenant />
            </Auth>
          }
        >
          <Route
            path=":tenantId"
            element={
              <Auth>
                <TenantView />
              </Auth>
            }
          />
          <Route
            path="new"
            element={
              <Auth>
                <TenantNew />
              </Auth>
            }
          />
        </Route>
        <Route path="auth" element={<AuthPage />} />
      </Route>
    </Routes>
  )
}

export default PageRoutes
