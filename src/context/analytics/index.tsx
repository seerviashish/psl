import React from 'react'

export interface IAnalyticsContext {}

const AnalyticsContext = React.createContext<IAnalyticsContext>({})

const { Consumer, Provider } = AnalyticsContext

interface IAnalyticsProvider {
  children: React.ReactNode
}

const AnalyticsProvider: React.FC<IAnalyticsProvider> = ({ children }) => {
  return <Provider value={{}}>{children}</Provider>
}

export { Consumer as AnalyticsConsumer, AnalyticsContext, AnalyticsProvider }
