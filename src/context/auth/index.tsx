import { Analytics, getAnalytics } from 'firebase/analytics'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { AuthState, SignInFormValue, SignUpFormValue } from '../../types'
export interface IAuthContext {
  isAuthenticated: boolean
  firebaseApp?: FirebaseApp
  analytics?: Analytics
  authState?: AuthState
  user?: User | null
  logout?: () => Promise<void>
  signIn?: (value: SignInFormValue) => Promise<void>
  signInWithGoogle?: () => Promise<void>
  signUp?: (value: SignUpFormValue) => Promise<void>
  signUpWithGoogle?: () => Promise<void>
}

const AuthContext = React.createContext<IAuthContext>({
  isAuthenticated: false,
})

const { Consumer, Provider } = AuthContext

interface IAuthProvider {
  children: React.ReactNode
}

const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  // // display: 'popup',
  // display: 'redirect'
})

const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authState, _setAuthState] = useState<AuthState>()
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>()
  const [analytics, setAnalytics] = useState<Analytics>()

  const handleAuthChange = (user: User | null) => {
    if (user) {
      setUser(user)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    if (!firebaseApp) return
    const auth = getAuth(firebaseApp)
    onAuthStateChanged(auth, handleAuthChange)
  }, [firebaseApp])

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

    setFirebaseApp(firebaseApp)
    setAnalytics(analytics)
  }, [])

  const logout = async () => {
    setIsAuthenticated(false)
  }

  const signInWithGoogle = async () => {
    try {
      if (!firebaseApp) return
      const auth = getAuth(firebaseApp)
      const userCredential = await signInWithPopup(auth, googleProvider)
      const authCredential =
        GoogleAuthProvider.credentialFromResult(userCredential)
      console.log('authCredential => ', authCredential)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log('error => ', {
        error,
        errorCode,
        email,
        errorMessage,
        credential,
      })
    }
  }

  const signUpWithGoogle = async () => {
    try {
      if (!firebaseApp) return
      const auth = getAuth(firebaseApp)
      const userCredential = await signInWithPopup(auth, googleProvider)
      const authCredential =
        GoogleAuthProvider.credentialFromResult(userCredential)
      console.log('authCredential => ', authCredential)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log('error => ', {
        error,
        errorCode,
        email,
        errorMessage,
        credential,
      })
    }
  }

  const signIn = async () => {}
  const signUp = async () => {}

  return (
    <Provider
      value={{
        isAuthenticated,
        logout,
        analytics,
        firebaseApp,
        authState,
        signInWithGoogle,
        signUpWithGoogle,
        signUp,
        signIn,
        user,
      }}
    >
      {children}
    </Provider>
  )
}

export { Consumer as AuthConsumer, AuthContext, AuthProvider }
