import { Analytics, getAnalytics } from 'firebase/analytics'
import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  RemoteConfig,
  ensureInitialized,
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from 'firebase/remote-config'
import React, { useEffect, useState } from 'react'
import { FBaseConfig, FBaseConfigKey } from '../../types'
import {
  DEV_REFETCH_INTERVAL,
  PROD_REFETCH_INTERVAL,
} from '../../utils/constants'

export interface IFBaseContext {
  firebaseApp?: FirebaseApp
  analytics?: Analytics
  remoteConfig?: RemoteConfig
  isRecentConfigActivated: boolean
  activateRecentConfig?: () => Promise<void>
  getConfigValue?: <Key extends `${FBaseConfigKey}`>(
    fBaseConfigKey: Key
  ) => FBaseConfig<Key>
}

const FBaseContext = React.createContext<IFBaseContext>({
  firebaseApp: undefined,
  analytics: undefined,
  remoteConfig: undefined,
  isRecentConfigActivated: false,
})

const { Consumer, Provider } = FBaseContext

interface IAnalyticsProvider {
  children: React.ReactNode
}

const FBaseProvider: React.FC<IAnalyticsProvider> = ({ children }) => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>()
  const [analytics, setAnalytics] = useState<Analytics>()
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig>()
  const [isRecentConfigActivated, setRecentConfigActivated] =
    useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (remoteConfig == null) return

    const getConfigAndActivate = async () => {
      const isRecentConfigActivated = await fetchAndActivate(remoteConfig)
      await ensureInitialized(remoteConfig)
      setRecentConfigActivated(isRecentConfigActivated)
      setIsLoaded(true)
    }
    getConfigAndActivate()
  }, [remoteConfig])

  useEffect(() => {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    }
    const firebaseApp = initializeApp(firebaseConfig)
    const analytics = getAnalytics(firebaseApp)
    const remoteConfig = getRemoteConfig(firebaseApp)
    const isDevEnv = import.meta.env.DEV
    remoteConfig.settings.minimumFetchIntervalMillis = isDevEnv
      ? DEV_REFETCH_INTERVAL
      : PROD_REFETCH_INTERVAL
    setFirebaseApp(firebaseApp)
    setAnalytics(analytics)
    setRemoteConfig(remoteConfig)
  }, [])

  const activateRecentConfig = async (): Promise<void> => {
    if (remoteConfig == null) throw new Error('RemoteConfig is null')
    const isRecentConfigActivated = await fetchAndActivate(remoteConfig)
    setRecentConfigActivated(isRecentConfigActivated)
  }

  const getConfigValue = <Key extends `${FBaseConfigKey}`>(
    fBaseConfigKey: Key
  ): FBaseConfig<Key> => {
    if (remoteConfig == null) throw new Error('RemoteConfig is null')
    if (
      fBaseConfigKey === FBaseConfigKey.CONFIG ||
      fBaseConfigKey === FBaseConfigKey.MAINTENANCE ||
      fBaseConfigKey === FBaseConfigKey.COUNTRIES
    ) {
      const config = getValue(remoteConfig, fBaseConfigKey).asString()
      if (!config) return null as FBaseConfig<Key>
      return JSON.parse(config) as FBaseConfig<Key>
    }
    return null as FBaseConfig<Key>
  }

  return (
    <Provider
      value={{
        firebaseApp,
        analytics,
        remoteConfig,
        isRecentConfigActivated,
        activateRecentConfig,
        getConfigValue,
      }}
    >
      {isLoaded && children}
    </Provider>
  )
}

export { Consumer as FBaseConsumer, FBaseContext, FBaseProvider }
