import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AnalyticsProvider } from './context/analytics'
import { AuthProvider } from './context/auth'
import { PermissionProvider } from './context/permission'
import { ThemeProvider } from './context/theme'
import PageRoutes from './pages/routes'

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

const App: React.FC = () => {
  return (
    <PermissionProvider>
      <ApolloProvider client={client}>
        <AnalyticsProvider>
          <ThemeProvider>
            <AuthProvider>
              <BrowserRouter basename="/">
                <PageRoutes />
              </BrowserRouter>
            </AuthProvider>
          </ThemeProvider>
        </AnalyticsProvider>
      </ApolloProvider>
    </PermissionProvider>
  )
}

export default App
